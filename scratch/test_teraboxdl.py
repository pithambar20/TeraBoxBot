import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import requests
import json
from urllib.parse import urlparse, parse_qs
import config

headers = {
    "Accept": "application/json, text/plain, */*",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "en-US,en;q=0.9",
    "Connection": "keep-alive",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
    "Cookie": config.TERABOX_COOKIE,
}

url = "https://terasharefile.com/s/1YqkqsmzOAEKYHHdPls9dfA"
temp_req = requests.get(url, headers=headers, timeout=30)
print("Temp req url:", temp_req.url)
parsed_url = urlparse(temp_req.url)
query_params = parse_qs(parsed_url.query)
surl = query_params.get("surl", [""])[0]

req = requests.get(temp_req.url, headers=headers, timeout=30)
respo = req.text

def find_between(s, start, end):
    si = s.find(start) + len(start)
    ei = s.find(end, si)
    return s[si:ei] if si != -1 and ei != -1 else ""

js_token = find_between(respo, 'fn%28%22', '%22%29')
logid = find_between(respo, 'dp-logid=', '&')
bdstoken = find_between(respo, 'bdstoken":"', '"')

print(f"js_token: {js_token[:15]}..., logid: {logid}, bdstoken: {bdstoken}")

params = {
    "app_id": "250528",
    "web": "1",
    "channel": "dubox",
    "clienttype": "0",
    "jsToken": js_token,
    "dp-logid": logid,
    "page": "1",
    "num": "20",
    "by": "name",
    "order": "asc",
    "site_referer": temp_req.url,
    "shorturl": surl,
    "root": "1,",
}

req2 = requests.get("https://www.terabox.app/share/list", headers=headers, params=params, timeout=30)
print("share/list status:", req2.status_code)
print("share/list content:", req2.text[:500])
