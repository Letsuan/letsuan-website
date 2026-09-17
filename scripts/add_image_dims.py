import re
import sys
import glob
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMAGES_DIR = os.path.join(ROOT, "images")
EN_DIR = os.path.join(ROOT, "astro", "src", "pages")
ZH_DIR = os.path.join(ROOT, "astro", "src", "pages", "zh-TW")

DRY_RUN = "--apply" not in sys.argv

dim_cache = {}

def get_dims(basename):
    if basename in dim_cache:
        return dim_cache[basename]
    path = os.path.join(IMAGES_DIR, basename)
    if not os.path.exists(path):
        dim_cache[basename] = None
        return None
    with Image.open(path) as im:
        dims = im.size
    dim_cache[basename] = dims
    return dims

# Matches one image object: {"src": "...", "alt": "..."} possibly with more keys after alt (e.g. "plain": true)
IMG_OBJ_RE = re.compile(r'\{"src":\s*"([^"]+)",\s*"alt":\s*"((?:[^"\\]|\\.)*)"(.*?)\}')

def process_file(path):
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    m = re.search(r'const images = (\[.*?\]);', content)
    if not m:
        return None
    images_str = m.group(1)

    changed = False
    misses = []

    def repl(match):
        nonlocal changed
        src, alt, rest = match.group(1), match.group(2), match.group(3)
        if '"width"' in rest:
            return match.group(0)
        basename = os.path.basename(src)
        dims = get_dims(basename)
        if dims is None:
            misses.append(basename)
            return match.group(0)
        w, h = dims
        changed = True
        return f'{{"src": "{src}", "alt": "{alt}"{rest}, "width": {w}, "height": {h}}}'

    new_images_str = IMG_OBJ_RE.sub(repl, images_str)

    if not changed:
        return {"path": path, "changed": False, "misses": misses}

    new_content = content.replace(f'const images = {images_str};', f'const images = {new_images_str};', 1)

    if not DRY_RUN:
        with open(path, "w", encoding="utf-8") as f:
            f.write(new_content)

    return {"path": path, "changed": True, "misses": misses}

def main():
    files = sorted(glob.glob(os.path.join(EN_DIR, "project-*.astro"))) + \
            sorted(glob.glob(os.path.join(ZH_DIR, "project-*.astro")))

    total_changed = 0
    total_misses = 0
    for f in files:
        r = process_file(f)
        if r is None:
            print(f"SKIP (no images array): {os.path.relpath(f, ROOT)}")
            continue
        if r["changed"]:
            total_changed += 1
        if r["misses"]:
            total_misses += len(r["misses"])
            print(f"MISS in {os.path.relpath(f, ROOT)}: {r['misses']}")

    print(f"\nFiles updated: {total_changed} / {len(files)}")
    print(f"Images with no dims found: {total_misses}")
    print(f"Mode: {'DRY RUN' if DRY_RUN else 'APPLIED'}")

if __name__ == "__main__":
    main()
