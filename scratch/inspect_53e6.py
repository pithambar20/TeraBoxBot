import requests

js_url = 'https://terastaticc.com/fe-opera-static/node-static-v4/fe-webv4-wap-share/js/shareFilelist.40d68e8f.js'
r = requests.get(js_url, timeout=15)
text = r.text

idx = text.find('"53e6":')
if idx != -1:
    print(text[idx:idx+800])
else:
    # search for 53e6 in webpack modules
    idx2 = text.find('53e6')
    print('idx2:', idx2)
    print(text[idx2-50:idx2+400])
