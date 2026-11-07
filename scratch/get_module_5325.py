import requests
import re

js_files = [
    "https://terastaticc.com/fe-opera-static/node-static-v4/fe-webv4-wap-share/js/manifest.7cceca01.js",
    "https://terastaticc.com/fe-opera-static/node-static-v4/fe-webv4-wap-share/js/shareFilelist.c5805d32.js",
    "https://terastaticc.com/fe-opera-static/node-static-v4/fe-webv4-wap-share/js/default~shareCode~shareComplaint~shareDownload~shareFilelist~shareReport~shareReportGuide.30d40c62.js",
    "https://terastaticc.com/fe-opera-static/node-static-v4/fe-webv4-wap-share/js/default~shareCode~shareFilelist~shortDramaCampaign.0b6ed4b9.js",
    "https://terastaticc.com/fe-opera-static/node-static-v4/fe-webv4-wap-share/js/chunk-vendors.96cc75be.js",
    "https://terastaticc.com/fe-opera-static/node-static-v4/fe-webv4-wap-share/js/main.18b4b7f8.js"
]

for js in js_files:
    text = requests.get(js).text
    for m in re.finditer(r'["\']5325["\']\s*:', text):
        print(f"Found in {js}")
        idx = m.start()
        print(text[idx:idx+600])
