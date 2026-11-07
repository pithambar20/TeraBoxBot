import requests
import re
import urllib.parse

test_url = 'https://terasharefile.com/s/1YqkqsmzOAEKYHHdPls9dfA'
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

for site in ['https://linkplay.in', 'https://teravideo.in', 'https://playterabox.com']:
    try:
        r = requests.get(site, headers=headers)
        print(f"=== {site} ===")
        forms = re.findall(r'<form[^>]*action=[\'"]([^\'"]*)[\'"]', r.text)
        print("Forms:", forms)
        # Search for player url pattern
        matches = re.findall(r'href=[\'"]([^\'"]*(?:play|watch|video|embed)[^\'"]*)[\'"]', r.text)
        print("Player hrefs:", matches[:5])
    except Exception as e:
        print(f"Error {site}: {e}")
