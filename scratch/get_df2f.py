import requests

url = "https://terastaticc.com/fe-opera-static/node-static-v4/fe-webv4-wap-share/js/main.18b4b7f8.js"
t = requests.get(url).text
idx = t.find('"df2f":')
if idx != -1:
    print(t[idx:idx+800])
else:
    print("df2f not in main, searching chunk-vendors")
    url2 = "https://terastaticc.com/fe-opera-static/node-static-v4/fe-webv4-wap-share/js/chunk-vendors.96cc75be.js"
    t2 = requests.get(url2).text
    idx2 = t2.find('"df2f":')
    if idx2 != -1:
        print(t2[idx2:idx2+800])
    else:
        print("Not in chunk-vendors either")
