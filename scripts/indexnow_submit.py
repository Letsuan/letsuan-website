"""Submit all sitemap URLs to IndexNow (Bing, Yandex, and other participating engines).

Run this manually after deploying content changes:

    python3 scripts/indexnow_submit.py

Requires the key file at the site root (<key>.txt) to already be deployed
and reachable at https://letsuan.com/<key>.txt -- IndexNow verifies it
before accepting submissions.
"""
import json
import re
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HOST = "letsuan.com"
KEY = "7df64234d1414da5bd75485ec6679d23"
KEY_LOCATION = f"https://{HOST}/{KEY}.txt"
ENDPOINT = "https://api.indexnow.org/indexnow"


def sitemap_urls():
    text = (ROOT / "sitemap.xml").read_text(encoding="utf-8")
    return re.findall(r"<loc>(.*?)</loc>", text)


def main():
    urls = sitemap_urls()
    if not urls:
        print("No URLs found in sitemap.xml")
        return

    payload = json.dumps({
        "host": HOST,
        "key": KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": urls,
    }).encode("utf-8")

    req = urllib.request.Request(
        ENDPOINT,
        data=payload,
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req) as resp:
            print(f"Submitted {len(urls)} URLs — status {resp.status}")
    except urllib.error.HTTPError as e:
        print(f"IndexNow submission failed: {e.code} {e.reason}")
        print(e.read().decode("utf-8", errors="replace"))


if __name__ == "__main__":
    main()
