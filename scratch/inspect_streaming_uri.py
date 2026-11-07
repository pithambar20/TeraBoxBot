import requests

js_url = 'https://terastaticc.com/fe-opera-static/node-static-v4/fe-webv4-wap-share/js/shareFilelist.40d68e8f.js'
r = requests.get(js_url, timeout=15)
text = r.text

idx = text.find('getVideoStreamingURI')
if idx != -1:
    print(text[idx-50:idx+600])
