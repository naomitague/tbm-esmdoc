# ET Method Lookup

Fills in the "ET Estimation Method" column for your Table 4 vault entries by
querying Crossref for each citation and keyword-scanning the abstract.

## Setup

Requires only the Python standard library — no `pip install` needed.
Python 3.7+.

1. Open `lookup_et_methods.py` and set `MAILTO` near the top to your email
   address. This isn't required, but Crossref gives faster/more reliable
   responses to requests that identify a contact ("the polite pool").

2. (Optional) Edit `input_citations.csv` — it's pre-filled with all 46
   citations from your Table 4, each with a short search hint drawn from
   the site description to improve match accuracy. Add/adjust hints if a
   result comes back wrong.

## Run it

```bash
cd et_method_lookup
python lookup_et_methods.py input_citations.csv output_results.csv
```

This takes about a minute (one request per second, ~46 citations).

## Output columns

| Column | Meaning |
|---|---|
| `citation` | The input citation string |
| `match_title` | Title of the paper Crossref matched |
| `match_doi` | DOI — click `https://doi.org/<doi>` to check the paper directly |
| `match_year` | Year from the matched record |
| `match_score` | 0–2. 2 = year AND author surname both matched. 0–1 = check manually |
| `abstract_found` | Whether Crossref had an abstract to scan (coverage varies by publisher — AGU/Wiley/Elsevier are decent, some journals have none indexed) |
| `method_category` | Best guess: `RS`, `LSM`, or `Field/Statistical` |
| `method_detail` | Specific product/model/technique detected (e.g. "MODIS", "Eddy covariance", "CLM4") |
| `matched_keyword` | The literal keyword that triggered the guess — useful for spot-checking false positives |
| `confidence_note` | Flags rows that need manual review |

## Important caveats

- **This is a fuzzy match, not a verified citation lookup.** Table 4 only
  gives author + year, so the query has to guess the right paper among
  possibly several by the same author in the same year. Always check
  `match_title` against what you'd expect before trusting the method guess.
- **Missing abstracts ≠ no method.** Many older or non-open-access papers
  aren't abstract-indexed in Crossref. A blank `method_category` usually
  means "go read the paper," not "this used no method."
- **Keyword matching is naive.** A paper that mentions "eddy covariance"
  only to say it *compared against* an eddy covariance dataset (rather than
  using EC itself) would be mis-flagged. Treat `method_detail` as a strong
  hint, not a citation-ready fact.
- Rows with `match_score` of 0–1 or blank `abstract_found` are the ones
  most worth spot-checking by hand before updating your vault table.

## After running

Once you've spot-checked the output, you can merge `method_category` +
`method_detail` back into your Table 4 markdown as the "ET Estimation
Method" column values (e.g. `Field/Statistical — Eddy covariance`,
`RS — MODIS`, `LSM — CLM4`).
