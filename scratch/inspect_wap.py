import requests
import re
import json

url = 'https://www.terabox.app/wap/share/filelist?surl=YqkqsmzOAEKYHHdPls9dfA'
headers = {
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
}
r = requests.get(url, headers=headers)

print("Page length:", len(r.text))
js_files = re.findall(r'src="([^"]+\.js[^"]*)"', r.text)
print("Found JS files:", len(js_files))
for js in js_files:
    print("JS:", js)

# Let's inspect the main JS bundles to see how it constructs the streaming URL or download URL
for js in js_files:
    if "chunk" in js or "app" in js or "share" in js or "wap" in js:
        try:
            full_js_url = js if js.startswith("http") else ("https://www.terabox.app" + js)
            js_res = requests.get(full_js_url, headers=headers, timeout=10)
            if "streaming" in js_res.text:
                print("Found 'streaming' in", js)
                # Find occurrences of streaming
                matches = re.findall(r'(\w+streaming\w*)', js_res.text)
                print("Occurrences:", set(matches))
                # Find url patterns with streaming
                url_matches = re.findall(r'["\']([^"\']*streaming[^"\']*)["\']', js_res.text)
                print("URL matches:", url_matches)
        except Exception as e:
            print("Error reading JS:", e)
