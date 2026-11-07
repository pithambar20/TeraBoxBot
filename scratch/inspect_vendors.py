import requests

for url in [
    'https://terastaticc.com/fe-opera-static/node-static-v4/fe-webv4-wap-share/js/chunk-vendors.96cc75be.js',
    'https://terastaticc.com/fe-opera-static/node-static-v4/fe-webv4-wap-share/js/main.2986c26e.js'
]:
    r = requests.get(url, timeout=15)
    idx = r.text.find('"5325":')
    if idx != -1:
        print(f"Found in {url}:")
        print(r.text[idx:idx+400])
        break
