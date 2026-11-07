import requests
import re

for js in [
    'https://terastaticc.com/fe-opera-static/node-static-v4/fe-webv4-wap-share/js/chunk-vendors.96cc75be.js',
    'https://terastaticc.com/fe-opera-static/node-static-v4/fe-webv4-wap-share/js/default~shareCode~shareComplaint~shareDownload~shareFilelist~shareReport~shareReportGuide.30d40c62.js'
]:
    t = requests.get(js).text
    idx = t.find('5325')
    while idx != -1:
        print(f"Match around index {idx} in {js}:")
        print(t[max(0, idx-50):min(len(t), idx+100)])
        idx = t.find('5325', idx + 1)
