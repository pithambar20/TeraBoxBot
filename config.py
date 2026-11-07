import os
from pathlib import Path
from dotenv import load_dotenv

# Base directory
BASE_DIR = Path(__file__).resolve().parent

# Load environment variables from .env file
load_dotenv(dotenv_path=BASE_DIR / ".env")

# Telegram Bot Token
BOT_TOKEN = os.getenv("BOT_TOKEN", "").strip()

# TeraBox Cookie (typically 'ndus=...' or raw ndus token value)
TERABOX_COOKIE = os.getenv("TERABOX_COOKIE", "").strip()

# Ensure cookie format is formatted properly if only the raw ndus token is supplied
if TERABOX_COOKIE and not ("=" in TERABOX_COOKIE):
    TERABOX_COOKIE = f"ndus={TERABOX_COOKIE}; lang=en;"
elif TERABOX_COOKIE and "ndus=" in TERABOX_COOKIE and "lang=" not in TERABOX_COOKIE:
    TERABOX_COOKIE = f"{TERABOX_COOKIE}; lang=en;"

# Download directory
DOWNLOAD_DIR = BASE_DIR / os.getenv("DOWNLOAD_DIR", "downloads")
DOWNLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Telegram API credentials for MTProto (up to 2,000 MB / 2 GB video uploads)
TELEGRAM_API_ID = int(os.getenv("TELEGRAM_API_ID", "0") or "0")
TELEGRAM_API_HASH = os.getenv("TELEGRAM_API_HASH", "").strip()

# Maximum file size that Telegram MTProto can upload (2 GB)
MAX_TG_UPLOAD_BYTES = int(os.getenv("MAX_TG_UPLOAD_BYTES", 2000 * 1024 * 1024))

# Download stream block size (64 KB)
STREAM_CHUNK_SIZE = 64 * 1024

# Network timeout (seconds)
NETWORK_TIMEOUT = int(os.getenv("NETWORK_TIMEOUT", 60))

