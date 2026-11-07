import re
with open(r'C:\Users\admin\.gemini\antigravity\brain\a2349db3-41ae-4091-9634-000de12e8558\.system_generated\steps\610\content.md', encoding='utf-8') as f:
    text = f.read()
m = re.findall(r'href="/saahiyo-cloud/TeraBridge-api/blob/([^/]+)/downloader\.py"', text)
print('Branches:', set(m))
