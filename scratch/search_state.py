import requests
import re
import json

url = 'https://terasharefile.com/s/1YqkqsmzOAEKYHHdPls9dfA'
headers = {
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
}
r = requests.get(url, headers=headers)
scripts = re.findall(r'<script[^>]*>(.*?)</script>', r.text, re.DOTALL)
for s in scripts:
    if 'window.__INITIAL_STATE__' in s:
        raw = s.split('window.__INITIAL_STATE__=', 1)[1].split(';(function()', 1)[0].strip()
        if raw.endswith(';'): raw = raw[:-1]
        data = json.loads(raw)
        
        # Search everywhere in data for http or mp4 or m3u8
        def search_urls(obj, path=""):
            if isinstance(obj, dict):
                for k, v in obj.items():
                    search_urls(v, f"{path}.{k}")
            elif isinstance(obj, list):
                for i, v in enumerate(obj):
                    search_urls(v, f"{path}[{i}]")
            elif isinstance(obj, str):
                if any(x in obj.lower() for x in ['.mp4', '.m3u8', 'streaming', 'download', 'd.terabox', 'dlink', 'video']):
                    if not any(x in obj.lower() for x in ['tiktok', 'pixel', 'google', 'facebook']):
                        print(f"{path}: {obj[:150]}")

        print("Searching all URLs in state:")
        search_urls(data)
