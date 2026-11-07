import requests
import re
import json
import hashlib
import time
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import config

headers = {
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Cookie': config.TERABOX_COOKIE,
}

session = requests.Session()
r = session.get('https://terasharefile.com/s/1YqkqsmzOAEKYHHdPls9dfA', headers=headers, allow_redirects=True, timeout=15)
scripts = re.findall(r'<script[^>]*>(.*?)</script>', r.text, re.DOTALL)
share_info = None
for s in scripts:
    if 'window.__INITIAL_STATE__' in s:
        raw = s.split('window.__INITIAL_STATE__=', 1)[1]
        raw = raw.split(';(function()', 1)[0].strip()
        if raw.endswith(';'): raw = raw[:-1]
        data = json.loads(raw)
        share_info = data['share']['shareInfo']
        break

# Extract jsToken
js_token_match = re.search(r'fn%28%22([^%]+)%22%29', r.text)
js_token = js_token_match.group(1) if js_token_match else ''

# Extract browserid from cookies
browserid = session.cookies.get('browserid', '')
print('browserid:', browserid)
print('jsToken:', js_token[:20] + '...')

p = int(time.time())
clienttype = "0"
channel = "dubox"
app_id = "250528"
web = "1"

# MD5 sign
raw_sign_str = f"{clienttype}{channel}{browserid}{p}"
sign = hashlib.md5(raw_sign_str.encode('utf-8')).hexdigest()
print('sign:', sign)

uk = share_info['uk']
shareid = share_info['shareid']
fs_id = share_info['fileInfo']['fs_id']

stream_headers = {
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15',
    'Accept': '*/*',
    'Referer': r.url,
}

stream_url = (
    f"https://www.1024tera.com/share/streaming.m3u8?"
    f"uk={uk}&shareid={shareid}&type=M3U8_AUTO_480&fid={fs_id}&sign={sign}"
    f"&timestamp={p}&esl=1&isplayer=1&ehps=1&clienttype={clienttype}"
    f"&app_id={app_id}&web={web}&channel={channel}&jsToken={js_token}"
)

print('Requesting:', stream_url)
r_stream = session.get(stream_url, headers=stream_headers, timeout=15)
print('Streaming status:', r_stream.status_code)
print('Streaming content-type:', r_stream.headers.get('Content-Type'))
print('Content snippet:', r_stream.text[:300])
