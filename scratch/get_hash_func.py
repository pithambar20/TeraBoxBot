import requests
import re

url = "https://terastaticc.com/fe-opera-static/node-static-v4/fe-webv4-wap-share/js/shareFilelist.c5805d32.js"
r = requests.get(url)
text = r.text

# Find where `o =` or `import` of `o` or `from` or how `o` is defined
# Look for `var o =` or `o = n(`
matches = re.findall(r'var\s+o\s*=\s*n\([^\)]+\)', text)
print("o definition matches:", matches)

# Also let's search for "M3U8_AUTO_480" context to see the whole function
idx = text.find("M3U8_AUTO_480")
print("Function context:")
print(text[max(0, idx - 500):min(len(text), idx + 800)])
