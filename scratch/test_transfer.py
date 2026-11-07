import requests
import re
import json
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

# Extract shareInfo
scripts = re.findall(r'<script[^>]*>(.*?)</script>', r.text, re.DOTALL)
share_info = None
for s in scripts:
    if 'templateData' in s:
        print('templateData snippet:', s[:300])
    if 'window.__INITIAL_STATE__' in s:
        raw = s.split('window.__INITIAL_STATE__=', 1)[1]
        raw = raw.split(';(function()', 1)[0].strip()
        if raw.endswith(';'): raw = raw[:-1]
        data = json.loads(raw)
        share_info = data['share']['shareInfo']

print('share_info:', share_info)
fs_id = share_info['fileInfo']['fs_id']
shareid = share_info['shareid']
from_uk = share_info['uk']

# Test /share/transfer
transfer_headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Referer': r.url,
    'Cookie': config.TERABOX_COOKIE,
}

params = {
    'app_id': '250528',
    'web': '1',
    'channel': 'dubox',
    'clienttype': '0',
    'shareid': shareid,
    'from': from_uk,
}

data = {
    'fsidlist': f'[{fs_id}]',
    'path': '/',
}

transfer_url = f"https://www.1024tera.com/share/transfer?app_id=250528&web=1&channel=dubox&clienttype=0&shareid={shareid}&from={from_uk}"
r_tf = session.post(transfer_url, data=data, headers=transfer_headers, timeout=15)
print('Transfer status:', r_tf.status_code)
print('Transfer response:', r_tf.text)
