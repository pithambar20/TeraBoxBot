import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import requests
import json
import config

ndus = config.TERABOX_COOKIE
print("Using ndus:", ndus)

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Cookie": ndus if "ndus=" in ndus else f"ndus={ndus}",
    "Referer": "https://www.terabox.com/main",
}

for domain in ["terabox.com", "1024tera.com", "terabox.app"]:
    try:
        r = requests.get(f"https://www.{domain}/api/user/getinfo", headers=headers, timeout=10)
        print(f"{domain} status: {r.status_code}, response: {r.text}")
    except Exception as e:
        print(f"{domain} error: {e}")
