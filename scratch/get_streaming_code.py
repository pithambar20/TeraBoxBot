import requests
import re

url = "https://terastaticc.com/fe-opera-static/node-static-v4/fe-webv4-wap-share/js/shareFilelist.c5805d32.js"
r = requests.get(url)
text = r.text

idx = text.find("/share/streaming.m3u8")
while idx != -1:
    start = max(0, idx - 400)
    end = min(len(text), idx + 400)
    print("--- CONTEXT ---")
    print(text[start:end])
    idx = text.find("/share/streaming.m3u8", idx + 1)
