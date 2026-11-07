import requests
import re

js_url = 'https://terastaticc.com/fe-opera-static/node-static-v4/fe-webv4-wap-share/js/shareFilelist.40d68e8f.js'
r = requests.get(js_url, timeout=15)
text = r.text

matches = [m.start() for m in re.finditer(r't\(["\'`]video["\'`]', text)]
print('Matches for t("video"):', len(matches))
for idx in matches:
    print('---', text[max(0, idx-50):min(len(text), idx+300)])
