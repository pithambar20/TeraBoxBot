import requests
import re
import json
import urllib.parse

url = 'https://terasharefile.com/s/1YqkqsmzOAEKYHHdPls9dfA'
session = requests.Session()
session.headers.update({
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
})

r = session.get(url, allow_redirects=True)
match = re.search(r'window\.__INITIAL_STATE__=(.*?);\(function\(\)', r.text, re.DOTALL)
if match:
    data = json.loads(match.group(1).rstrip(';'))
    share = data.get('share', {})
    shareInfo = share.get('shareInfo', {})
    fileInfo = shareInfo.get('fileInfo', {})
    jsToken = data.get('jsToken')
    
    jsToken_unquote = urllib.parse.unquote(jsToken or '')
    token_match = re.search(r'fn\(["\'](.*?)["\']\)', jsToken_unquote)
    token = token_match.group(1) if token_match else ''

    uk = shareInfo.get('uk')
    shareid = shareInfo.get('shareid')
    sign = shareInfo.get('sign')
    timestamp = shareInfo.get('timestamp')
    fs_id = fileInfo.get('fs_id')
    randsk = shareInfo.get('randsk')

    print(f"uk={uk}, shareid={shareid}, sign={sign}, timestamp={timestamp}, fs_id={fs_id}")
    print(f"token={token[:20]}..., randsk={randsk}")

    # Check cookies from session
    cookie_dict = session.cookies.get_dict()
    print("Session cookies:", cookie_dict)

    # Test streaming m3u8
    stream_url = f'https://www.1024tera.com/share/streaming.m3u8?uk={uk}&shareid={shareid}&type=M3U8_AUTO_480&fid={fs_id}&sign={sign}&timestamp={timestamp}&esl=1&isplayer=1&ehps=1&clienttype=0&app_id=250528&web=1&channel=dubox&jsToken={token}'
    headers = {
        'User-Agent': session.headers['User-Agent'],
        'Referer': r.url,
        'Origin': 'https://www.1024tera.com',
    }
    # Add BDCLND cookie if present in randsk
    if randsk:
        session.cookies.set('BDCLND', urllib.parse.unquote(randsk), domain='.1024tera.com')

    r2 = session.get(stream_url, headers=headers)
    print("Streaming status:", r2.status_code)
    print("Streaming content:", r2.text[:300])

    # Also test download link api: /share/download
    dl_api = f'https://www.1024tera.com/share/download?uk={uk}&shareid={shareid}&timestamp={timestamp}&sign={sign}&fid_list=%5B{fs_id}%5D&clienttype=0&app_id=250528&web=1&channel=dubox&jsToken={token}'
    r3 = session.get(dl_api, headers=headers)
    print("Download API status:", r3.status_code)
    print("Download API content:", r3.text[:300])
