import requests
import re
import json

test_url = "https://terasharefile.com/s/1YqkqsmzOAEKYHHdPls9dfA"

sites = [
    "https://teraboxdownloader.pro/api/fetch",
    "https://terabox.tools/api/get-info",
    "https://teraboxdl.site/api/get-info",
    "https://teradownloader.com/api/fetch",
    "https://yt1s.click/api/ajaxSearch",
    "https://savebox.online/api/get-info",
    "https://teradownload.online/api/get-info",
]

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Content-Type": "application/json",
    "Accept": "application/json, text/plain, */*",
}

for site in sites:
    try:
        r = requests.post(site, json={"url": test_url}, headers=headers, timeout=5)
        print(f"POST {site}: {r.status_code}")
        if r.status_code == 200:
            print("Response:", r.text[:300])
    except Exception as e:
        # try GET
        try:
            r = requests.get(f"{site}?url={test_url}", headers=headers, timeout=5)
            print(f"GET {site}: {r.status_code}")
            if r.status_code == 200:
                print("Response:", r.text[:300])
        except Exception:
            pass
