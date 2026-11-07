with open('scratch/vendors.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('"1abe":')
if idx != -1:
    print(text[idx:idx+1000])
else:
    print('1abe not in vendors.js')
