cat > remove_dup_params.py <<'PY'
#!/usr/bin/env python3
import argparse
from pathlib import Path
import os
import sys

parser = argparse.ArgumentParser(description="Find and optionally delete underscore-duplicate parameter files.")
parser.add_argument("--delete", action="store_true", help="Actually delete matched underscore files")
parser.add_argument("--git", action="store_true", help="Use 'git rm' instead of os.remove (safer for repo history)")
args = parser.parse_args()

root = Path("models")
if not root.exists():
    print("models/ directory not found. Run from repo root.")
    sys.exit(1)

groups = {}
for p in root.rglob("parameters/*.md"):
    # normalized name: replace underscores with spaces, collapse whitespace, lowercase
    norm = " ".join(p.stem.replace("_", " ").split()).lower()
    groups.setdefault(norm, []).append(p)

to_delete = []
for norm, files in groups.items():
    unders = [f for f in files if "_" in f.name and " " not in f.name]
    spaces = [f for f in files if " " in f.name and "_" not in f.name]
    # also accept space vs underscore regardless of other chars
    if not unders or not spaces:
        continue
    for u in unders:
        matched = False
        for s in spaces:
            try:
                if u.read_bytes() == s.read_bytes():
                    to_delete.append((u, s))
                    matched = True
                    break
            except Exception as e:
                print("Error reading files:", u, s, e)
        if not matched:
            # try matching against any file in group by bytes
            for s in files:
                if s == u:
                    continue
                try:
                    if u.read_bytes() == s.read_bytes():
                        to_delete.append((u, s))
                        break
                except Exception:
                    pass

if not to_delete:
    print("No underscore-duplicate files found.")
    sys.exit(0)

print("Files that would be deleted (underscore -> kept counterpart):")
for u, s in to_delete:
    print(f"{u}  ->  {s}")

if not args.delete:
    print("\\nDry run complete. Re-run with --delete to remove the underscore files.")
    sys.exit(0)

# Deletion step
for u, s in to_delete:
    print("Removing", u)
    try:
        if args.git and (Path(".git").exists()):
            import subprocess
            subprocess.run(["git", "rm", "-f", str(u)], check=True)
        else:
            os.remove(u)
    except Exception as e:
        print("Failed to remove", u, ":", e)

print("Deletion complete.")
PY
