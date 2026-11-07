# 🚀 TeraBox Telegram Video Downloader Bot

A Python-powered Telegram bot that extracts videos from TeraBox share links and sends playable videos directly into your Telegram chat.

---

## ✨ Features

- 🔗 **Automatic Link Detection**: Supports `terabox.com`, `teraboxapp.com`, `1024tera.com`, `terasharelink.com`, `tibibox.com`, and mirrors.
- ⚡ **Streamable Video Delivery**: Automatically sends files as streamable videos (`supports_streaming=True`) so you can watch directly inside Telegram.
- 📊 **Real-time Live Progress**: Shows dynamic visual progress bar `[████░░░░░░] 45%` and download speeds in Telegram.
- 🛡️ **Smart File Size Handling**:
  - Files **≤ 50 MB** are downloaded and sent directly into the chat.
  - Files **> 50 MB** (exceeding Telegram Bot API's limit) provide full metadata and a 1-click **Direct High-Speed Download** button.
- 🧹 **Automatic Cleanup**: Downloaded video files are automatically removed after sending to prevent filling up disk space.

---

## 📋 Prerequisites

1. **Python 3.10+** (Python 3.13 is fully supported)
2. **Telegram Bot Token** from [@BotFather](https://t.me/BotFather)
3. **TeraBox Cookie (`ndus`)** from your browser

---

## 🔑 How to Get Your Credentials

### 1. Telegram Bot Token
1. Open Telegram and search for [@BotFather](https://t.me/BotFather).
2. Send `/newbot`.
3. Give your bot a name and username (e.g. `MyTeraBoxDownloaderBot`).
4. Copy the API Token provided (e.g., `1234567890:ABCdefGHIjklMNO...`).

### 2. TeraBox `ndus` Cookie
TeraBox requires an active session cookie to generate direct, high-speed download links:
1. Open your browser (Chrome, Edge, Brave, or Firefox) and visit [terabox.com](https://www.terabox.com).
2. Log in to your TeraBox account.
3. Press **F12** (or Right-Click -> **Inspect**) to open Developer Tools.
4. Go to the **Application** tab (on Firefox, go to **Storage**).
5. In the left sidebar, expand **Cookies** and select `https://www.terabox.com`.
6. Look for the cookie named **`ndus`**.
7. Double-click and copy its **Value** (e.g., `Yabc123...`).

---

## 🛠️ Installation & Setup

1. **Clone or open the project folder:**
   ```bash
   cd c:\Users\admin\Documents\teraBoxBot
   ```

2. **Install requirements:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure your environment:**
   Open the `.env` file and insert your credentials:
   ```env
   BOT_TOKEN=1234567890:ABCdefGHIjklMNO...
   TERABOX_COOKIE=Yyour_ndus_cookie_here...
   ```

4. **Run the bot:**
   ```bash
   python bot.py
   ```

---

## 💬 Usage in Telegram

1. Open a chat with your bot on Telegram.
2. Send `/start` to see the welcome guide.
3. Paste any TeraBox link:
   ```
   https://teraboxapp.com/s/1aB2c3D4e5F6
   ```
4. The bot will:
   - 🔍 Fetch file details
   - 📥 Stream download with live progress
   - 📤 Send the playable video directly into your chat!

---

## 📁 Project Structure

```
teraBoxBot/
├── bot.py               # Main Telegram bot handlers & UI
├── terabox_client.py    # Link resolver, streaming downloader & progress engine
├── config.py            # Environment & config loader
├── requirements.txt     # Python package dependencies
├── .env.example         # Sample environment variables template
├── .env                 # Your local secrets (ignored by git)
└── downloads/           # Temporary download directory (auto-cleaned)
```
