import requests

url = "https://terastaticc.com/fe-opera-static/node-static-v4/fe-webv4-wap-share/js/main.18b4b7f8.js"
t = requests.get(url).text
idx = t.find("function E(e)")
print(t[idx:idx+1500])
