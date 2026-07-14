"""
lookup_et_methods.py

Purpose
-------
Given a CSV list of citations (author + year, ideally + a couple of topic
keywords like "sap flow" or site name), this script:

  1. Queries the Crossref API to find the most likely matching paper
  2. Pulls the abstract text if Crossref has it (coverage varies by publisher)
  3. Scans the abstract for method keywords (eddy covariance, sap flow,
     Bowen ratio, lysimeter, scintillometer, MODIS, SEBAL, Penman-Monteith,
     Community Land Model, etc.) and produces a best-guess ET Estimation
     Method category: "RS" (with product name if detected), "LSM" (with
     model name if detected), "Field/Statistical" (ground-based, not RS),
     or "Unclear" if nothing matched.
  4. Writes results to an output CSV with a confidence flag so you can
     manually check the low-confidence rows before trusting them.

Usage
-----
    python lookup_et_methods.py input_citations.csv output_results.csv

Input CSV format (header required):
    citation
    "Du et al., 2011"
    "Gazal et al., 2006"
    ...

Optional: add a second column "hint" with extra search terms (site name,
species, region) to improve match quality, e.g.:
    citation,hint
    "Du et al., 2011","Loess Plateau sap flow"
    "Gazal et al., 2006","riparian cottonwood transpiration"

Notes
-----
- Crossref is free and doesn't require an API key, but including an email
  in the User-Agent (the "mailto" param below) gets you into their
  "polite pool" with faster, more reliable responses. Edit MAILTO below.
- This is a best-effort fuzzy match. Always check the "match_title" and
  "match_score" columns in the output before trusting a row -- a wrong
  Crossref match will produce a confidently wrong method guess.
- Rate-limited to be polite to Crossref's API (1 request per second).
"""

import csv
import re
import sys
import time
import urllib.parse
import urllib.request
import json

# ---- CONFIG ----------------------------------------------------------
MAILTO = "tague@ucsb.edu  # <-- put your email here (Crossref "polite pool")
REQUEST_DELAY_SEC = 1.0
CROSSREF_BASE = "https://api.crossref.org/works"

# Keyword groups used to guess ET estimation method from abstract text.
# Order matters: more specific / high-confidence terms first.
METHOD_KEYWORDS = {
    "RS": [
        ("MODIS", "MODIS"),
        ("SEBAL", "SEBAL"),
        ("SEBS", "SEBS"),
        ("METRIC", "METRIC"),
        ("Landsat", "Landsat"),
        ("AVHRR", "AVHRR"),
        ("remote sensing", None),
        ("satellite", None),
        ("Ts-VI", "Ts-VI triangle"),
        ("scintillometer", "Scintillometer (ground-based RS-adjacent)"),
    ],
    "LSM": [
        ("Community Land Model", "Community Land Model (CLM)"),
        ("CLM4", "CLM4"),
        ("CLM3", "CLM3"),
        ("Noah", "Noah LSM"),
        ("VIC model", "VIC"),
        ("SiB2", "SiB2"),
        ("SiB ", "SiB"),
        ("land surface model", None),
        ("GLDAS", "GLDAS"),
        ("ORCHIDEE", "ORCHIDEE"),
    ],
    "Field/Statistical": [
        ("eddy covariance", "Eddy covariance"),
        ("Bowen ratio", "Bowen ratio"),
        ("sap flow", "Sap flow"),
        ("lysimeter", "Lysimeter"),
        ("chamber method", "Chamber"),
        ("stable isotope", "Stable isotope"),
        ("water balance", "Water balance"),
        ("Penman-Monteith", "Penman-Monteith (field-parameterized)"),
        ("Priestley-Taylor", "Priestley-Taylor (field-parameterized)"),
    ],
}


def guess_method(abstract_text):
    """Return (category, detail, matched_keyword) or (None, None, None)."""
    if not abstract_text:
        return None, None, None
    text_lower = abstract_text.lower()
    for category, keyword_list in METHOD_KEYWORDS.items():
        for keyword, label in keyword_list:
            if keyword.lower() in text_lower:
                detail = label if label else keyword
                return category, detail, keyword
    return None, None, None


def strip_jats_tags(text):
    """Crossref abstracts often come wrapped in JATS XML tags; strip them."""
    if not text:
        return ""
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def query_crossref(bibliographic_query, mailto=MAILTO, rows=3):
    """
    Query Crossref's /works endpoint using a free-text bibliographic query.
    Returns the raw JSON 'items' list (up to `rows` candidates).
    """
    params = {
        "query.bibliographic": bibliographic_query,
        "rows": rows,
        "mailto": mailto,
    }
    url = CROSSREF_BASE + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": f"ETMethodLookup/1.0 (mailto:{mailto})"})
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        return data.get("message", {}).get("items", [])
    except Exception as e:
        print(f"  [!] Crossref query failed for '{bibliographic_query}': {e}", file=sys.stderr)
        return []


def parse_citation_author_year(citation_str):
    """
    Very rough parse of 'Author et al., YEAR' or 'Author, YEAR' style strings
    to extract a first-author surname and year, used to build the Crossref
    query and to sanity-check returned matches.
    """
    year_match = re.search(r"(19|20)\d{2}", citation_str)
    year = year_match.group(0) if year_match else ""
    author = re.split(r",| et al", citation_str)[0].strip()
    return author, year


def score_match(author, year, item):
    """
    Cheap heuristic confidence score (0-2):
      +1 if year matches
      +1 if first-author surname appears in Crossref author list
    """
    score = 0
    item_year = None
    for date_field in ("published-print", "published-online", "issued"):
        if date_field in item and "date-parts" in item[date_field]:
            parts = item[date_field]["date-parts"]
            if parts and parts[0]:
                item_year = str(parts[0][0])
                break
    if item_year and year and item_year == year:
        score += 1

    item_authors = item.get("author", [])
    author_surnames = [a.get("family", "").lower() for a in item_authors]
    if author.lower() in author_surnames:
        score += 1

    return score, item_year


def main():
    if len(sys.argv) != 3:
        print("Usage: python lookup_et_methods.py input_citations.csv output_results.csv")
        sys.exit(1)

    input_path, output_path = sys.argv[1], sys.argv[2]

    with open(input_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows_in = list(reader)

    results = []
    for i, row in enumerate(rows_in, start=1):
        citation = row["citation"].strip()
        hint = row.get("hint", "").strip()
        author, year = parse_citation_author_year(citation)

        query = f"{author} {year} evapotranspiration {hint}".strip()
        print(f"[{i}/{len(rows_in)}] Searching: {query}")

        items = query_crossref(query)
        time.sleep(REQUEST_DELAY_SEC)

        best_item, best_score, best_year = None, -1, None
        for item in items:
            score, item_year = score_match(author, year, item)
            if score > best_score:
                best_item, best_score, best_year = item, score, item_year

        if best_item is None:
            results.append({
                "citation": citation,
                "match_title": "",
                "match_doi": "",
                "match_year": "",
                "match_score": 0,
                "abstract_found": "No",
                "method_category": "",
                "method_detail": "",
                "matched_keyword": "",
                "confidence_note": "No Crossref match found -- check manually",
            })
            continue

        title = best_item.get("title", [""])[0] if best_item.get("title") else ""
        doi = best_item.get("DOI", "")
        abstract_raw = best_item.get("abstract", "")
        abstract_clean = strip_jats_tags(abstract_raw)

        category, detail, keyword = guess_method(abstract_clean)

        confidence_note = ""
        if best_score < 2:
            confidence_note = "LOW CONFIDENCE -- verify author/year match manually"
        if not abstract_clean:
            confidence_note += " | No abstract available from Crossref (check publisher site directly)"

        results.append({
            "citation": citation,
            "match_title": title,
            "match_doi": doi,
            "match_year": best_year or "",
            "match_score": best_score,
            "abstract_found": "Yes" if abstract_clean else "No",
            "method_category": category or "",
            "method_detail": detail or "",
            "matched_keyword": keyword or "",
            "confidence_note": confidence_note.strip(" |"),
        })

    fieldnames = [
        "citation", "match_title", "match_doi", "match_year", "match_score",
        "abstract_found", "method_category", "method_detail", "matched_keyword",
        "confidence_note",
    ]
    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(results)

    print(f"\nDone. Wrote {len(results)} rows to {output_path}")
    print("Remember: rows with match_score < 2 or 'No abstract available' need manual verification.")


if __name__ == "__main__":
    main()
