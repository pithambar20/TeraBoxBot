import requests
import json

test_url = "https://terasharefile.com/s/1YqkqsmzOAEKYHHdPls9dfA"
surl = "1YqkqsmzOAEKYHHdPls9dfA"

endpoints = [
    f"https://ytbvideolyrics.com/api/get-data?url={test_url}",
    f"https://teraboxvideodownloader.nepcoderdevs.workers.dev/?url={test_url}",
    f"https://terabox.ytbvideolyrics.com/api/get-info?url={test_url}",
    f"https://terabox-dl.qtcloud.workers.dev/api/get-info?shorturl={surl}",
    f"https://tera.instavidsave.com/api/get-info?url={test_url}",
    f"https://api.1024terabox.com/api/get-info?url={test_url}",
]

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/json, text/plain, */*",
}

for ep in endpoints:
    try:
        r = requests.get(ep, headers=headers, timeout=8)
        print(f"URL: {ep[:50]}... | Status: {r.status_code}")
        if r.status_code == 200:
            print("Response:", r.text[:300])
    except Exception as e:
        print(f"URL: {ep[:50]}... | Error: {e}")
