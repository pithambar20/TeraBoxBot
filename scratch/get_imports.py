import requests
import re

url = "https://terastaticc.com/fe-opera-static/node-static-v4/fe-webv4-wap-share/js/shareFilelist.c5805d32.js"
text = requests.get(url).text

# Find where `n["d"]` or `o["f"]` are defined in the file or imported
pos = text.find("M3U8_AUTO_480")
sub = text[max(0, pos - 1500):pos]
print("Pre-context:")
print(sub)
