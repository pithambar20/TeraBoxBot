import requests
import re

r = requests.get('https://terasaver.com/', timeout=10)
apis = re.findall(r'["\'](https?://[^"\']+|/api/[^"\']+)["\']', r.text)
print('Endpoints on terasaver:')
for a in set(apis):
    if any(k in a.lower() for k in ['api', 'download', 'fetch', 'file']):
        print(' -', a)

# check form actions
forms = re.findall(r'<form[^>]*action=["\']([^"\']+)["\']', r.text)
print('Forms:', forms)
