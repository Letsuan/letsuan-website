#!/usr/bin/env bash
# Rebuilds the Astro site and syncs the full output (HTML + hashed _astro
# CSS/JS assets) into the deployed root of the repo. Run this instead of
# manually copying individual .html files — a partial copy is what caused
# the "site is unstyled / 404 CSS" incidents.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "==> Building astro site"
(cd astro && npm run build)

echo "==> Syncing top-level pages"
find astro/dist -maxdepth 1 -type f -iname "*.html" ! -name "zh-TW.html" -exec cp {} . \;

echo "==> Syncing zh-TW/index.html"
cp astro/dist/zh-TW.html zh-TW/index.html

echo "==> Syncing zh-TW/*.html"
cp astro/dist/zh-TW/*.html zh-TW/

echo "==> Syncing _astro/ build assets"
cp astro/dist/_astro/* _astro/

echo "==> Verifying no missing asset/image references"
python3 - <<'PY'
import os, re, glob

astro_files = set(os.listdir('_astro'))
img_files = set(os.listdir('images'))
missing = []
for f in glob.glob('*.html') + glob.glob('zh-TW/*.html'):
    with open(f, encoding='utf-8', errors='ignore') as fh:
        content = fh.read()
    for m in re.finditer(r'_astro/([A-Za-z0-9_.\-]+\.(?:css|js))', content):
        if m.group(1) not in astro_files:
            missing.append((f, m.group(1)))
    for m in re.finditer(r'/images/([A-Za-z0-9_.\-]+\.(?:jpg|jpeg|png|avif|webp))', content):
        if m.group(1) not in img_files:
            missing.append((f, m.group(1)))

if missing:
    print(f"MISSING {len(missing)} referenced file(s):")
    for f, name in missing:
        print(f"  {f} -> {name}")
    raise SystemExit(1)
print("OK: every _astro/ and /images/ reference in the deployed HTML resolves.")
PY

echo "==> Done. Review with: git status --porcelain"
