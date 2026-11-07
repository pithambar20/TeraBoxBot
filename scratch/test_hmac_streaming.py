import hmac
import hashlib
import time
import requests
import json
import re
import urllib.parse

# 1. Fetch mobile wap page
session = requests.Session()
headers = {
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
}
url = 'https://terasharefile.com/s/1YqkqsmzOAEKYHHdPls9dfA'
r = session.get(url, headers=headers, allow_redirects=True)
print("Resolved URL:", r.url)

match = re.search(r'window\.__INITIAL_STATE__=(.*?);\(function\(\)', r.text, re.DOTALL)
data = json.loads(match.group(1).rstrip(';'))

shareInfo = data['share']['shareInfo']
fileInfo = data['share']['fileList'][0]
js_token_raw = urllib.parse.unquote(data.get('jsToken', ''))
token_match = re.search(r'fn\(["\']([a-fA-F0-9]+)["\']\)', js_token_raw)
js_token = token_match.group(1) if token_match else js_token_raw

uk = shareInfo['uk']
shareid = shareInfo['shareid']
fs_id = fileInfo['fs_id']

# Browserid cookie
browserid = session.cookies.get('browserid') or ''
print(f"uk: {uk}, shareid: {shareid}, fs_id: {fs_id}, browserid: {browserid}")

# Calculate sign y
u = int(time.time())
h = "0"
g = "dubox"
raw_sign_str = f"{h}{g}{browserid}{u}"
key = b"iuuPc64E4Fhn0rTXEzrnbLph0o5qyEEa"
y = hmac.new(key, raw_sign_str.encode('utf-8'), hashlib.sha1).hexdigest()
print(f"Calculated sign y: {y}")

# Call streaming.m3u8
stream_url = (
    f"https://www.1024tera.com/share/streaming.m3u8?"
    f"uk={uk}&shareid={shareid}&type=M3U8_AUTO_480&fid={fs_id}&sign={y}"
    f"&timestamp={u}&esl=1&isplayer=1&ehps=1&clienttype=0&app_id=250528&web=1&channel=dubox&jsToken={js_token}"
)
stream_headers = {
    'User-Agent': headers['User-Agent'],
    'Referer': r.url,
    'Origin': 'https://www.1024tera.com',
}
r_stream = session.get(stream_url, headers=stream_headers)
print("Streaming status:", r_stream.status_code)
print("Streaming response preview:")
print(r_stream.text[:500])
