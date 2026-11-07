import requests

js_files = [
    "https://terastaticc.com/fe-opera-static/node-static-v4/fe-webv4-wap/assets/libs/tiktok-pixel.js",
    "https://terastaticc.com/fe-opera-static/node-static-v4/fe-webv4-wap/assets/libs/meta-pixel.js",
    "https://terastaticc.com/fe-opera-static/node-static-v4/fe-webv4-wap-share/js/manifest.7cceca01.js",
    "https://terastaticc.com/fe-opera-static/node-static-v4/fe-webv4-wap-share/js/shareFilelist.c5805d32.js",
    "https://terastaticc.com/fe-opera-static/node-static-v4/fe-webv4-wap-share/js/default~shareCode~shareComplaint~shareDownload~shareFilelist~shareReport~shareReportGuide.30d40c62.js",
    "https://terastaticc.com/fe-opera-static/node-static-v4/fe-webv4-wap-share/js/default~shareCode~shareFilelist~shortDramaCampaign.0b6ed4b9.js",
    "https://terastaticc.com/fe-opera-static/node-static-v4/fe-webv4-wap-share/js/chunk-vendors.96cc75be.js",
    "https://terastaticc.com/fe-opera-static/node-static-v4/fe-webv4-wap-share/js/main.18b4b7f8.js",
    "https://www.terabox.app/ndbs/nd_bundle_430546.js"
]

for url in js_files:
    try:
        t = requests.get(url).text
        if "5325" in t:
            print(f"5325 in {url}")
            idx = t.find("5325")
            print(t[max(0, idx-50):min(len(t), idx+100)])
    except Exception as e:
        print(f"Error {url}: {e}")
