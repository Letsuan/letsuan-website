import re
import sys
import glob
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EN_DIR = os.path.join(ROOT, "astro", "src", "pages")
ZH_DIR = os.path.join(ROOT, "astro", "src", "pages", "zh-TW")
SITEMAP = os.path.join(ROOT, "sitemap.xml")

DRY_RUN = "--apply" not in sys.argv

def load_lastmods():
    with open(SITEMAP, encoding="utf-8") as f:
        content = f.read()
    mapping = {}
    for m in re.finditer(r"<loc>(https://letsuan\.com[^<]*)</loc>\s*<lastmod>([^<]+)</lastmod>", content):
        mapping[m.group(1).rstrip("/")] = m.group(2)
    return mapping

def canonical_for(path, is_zh):
    slug = os.path.basename(path)[:-len(".astro")]
    if is_zh:
        return f"https://letsuan.com/zh-TW/{slug}"
    return f"https://letsuan.com/{slug}"

def process_file(path, is_zh, lastmods):
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    if '"dateModified"' in content:
        return None

    m = re.search(r'"datePublished":\s*"([^"]*)"', content)
    if not m:
        return "NO_DATEPUBLISHED"

    canonical = canonical_for(path, is_zh)
    lastmod = lastmods.get(canonical)
    if not lastmod:
        return f"NO_LASTMOD ({canonical})"

    old = m.group(0)
    new = f'{old}, "dateModified": "{lastmod}"'
    new_content = content.replace(old, new, 1)

    if not DRY_RUN:
        with open(path, "w", encoding="utf-8") as f:
            f.write(new_content)

    return lastmod

def main():
    lastmods = load_lastmods()
    en_files = sorted(glob.glob(os.path.join(EN_DIR, "project-*.astro")))
    zh_files = sorted(glob.glob(os.path.join(ZH_DIR, "project-*.astro")))

    updated = 0
    skipped = 0
    for f in en_files:
        r = process_file(f, False, lastmods)
        if r is None:
            skipped += 1
        elif r.startswith("NO_"):
            print(f"MISS {os.path.relpath(f, ROOT)}: {r}")
        else:
            updated += 1
    for f in zh_files:
        r = process_file(f, True, lastmods)
        if r is None:
            skipped += 1
        elif r.startswith("NO_"):
            print(f"MISS {os.path.relpath(f, ROOT)}: {r}")
        else:
            updated += 1

    print(f"\nUpdated: {updated} / {len(en_files) + len(zh_files)} (already had dateModified: {skipped})")
    print(f"Mode: {'DRY RUN' if DRY_RUN else 'APPLIED'}")

if __name__ == "__main__":
    main()
