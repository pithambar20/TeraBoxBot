import os
import sys
import time
import asyncio
import logging
import urllib.parse
from pathlib import Path

# Ensure UTF-8 output and line buffering on Windows console
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", line_buffering=True)
        sys.stderr.reconfigure(encoding="utf-8", line_buffering=True)
    except Exception:
        pass

from telethon import TelegramClient, events, Button
from telethon.tl.types import (
    KeyboardInlineButton,
    InlineButtonTypeWebView,
)

import config
from terabox_client import TeraBoxClient, extract_terabox_url, format_bytes

# Configure logging to both console and file
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO,
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler(config.BASE_DIR / "bot.log", encoding="utf-8"),
    ],
)
logger = logging.getLogger(__name__)

# Validate credentials
if not config.BOT_TOKEN or not config.TELEGRAM_API_ID or not config.TELEGRAM_API_HASH:
    logger.error("BOT_TOKEN, TELEGRAM_API_ID, or TELEGRAM_API_HASH is missing in .env! Bot cannot start.")

client = TelegramClient(
    str(config.BASE_DIR / "bot_session"),
    config.TELEGRAM_API_ID,
    config.TELEGRAM_API_HASH,
)
tb_client = TeraBoxClient()


@client.on(events.NewMessage(pattern=r"^/start"))
async def handle_start(event):
    welcome_text = (
        "👋 **Welcome to TeraBox Online Video Player Bot!**\n\n"
        "Send me any TeraBox share link, and I will generate an instant **Online Video Player** "
        "and direct download links for you!\n\n"
        "✨ **Key Features:**\n"
        "• 🎬 **Instant Online Player**: Tap to stream and watch directly without waiting for downloads\n"
        "• ⚡ **Fast & Lightweight**: Instant response in 1 second\n"
        "• 🔗 **Multiple Download Mirrors**: Direct high-speed links\n\n"
        "👉 **Paste your TeraBox link below to get started!**"
    )
    await event.reply(welcome_text)


@client.on(events.NewMessage(pattern=r"^/help"))
async def handle_help(event):
    help_text = (
        "📖 **How to use TeraBox Video Bot**\n\n"
        "1. Copy any TeraBox video share link (e.g. from `terabox.com`, `1024tera.com`, `terasharefile.com`).\n"
        "2. Paste it into this chat.\n"
        "3. Tap **Online Player ▶️** to watch the video immediately inside Telegram!\n"
    )
    await event.reply(help_text)


@client.on(events.NewMessage(pattern=r"^/status"))
async def handle_status(event):
    status_text = (
        "🤖 **Bot Status & Health**\n\n"
        "• Online Player Engine: **Active ✅**\n"
        "• Telegram Bot: **Connected ✅**\n"
        "• Direct Streaming: **Enabled**\n"
    )
    await event.reply(status_text)


@client.on(events.NewMessage(func=lambda e: extract_terabox_url(e.text or "") is not None and not e.text.startswith("/")))
async def handle_terabox_link(event):
    text = event.text or ""
    raw_url = extract_terabox_url(text)
    if not raw_url:
        return

    logger.info(f"Received TeraBox URL: {raw_url} from user {event.sender_id}")

    status_msg = await event.reply("🔍 **Processing TeraBox link...**")

    try:
        # Step 1: Resolve metadata
        file_info = await asyncio.to_thread(tb_client.get_file_info, raw_url)
        if "error" in file_info:
            await status_msg.edit(f"❌ **Failed to resolve link:**\n{file_info['error']}")
            return

        file_name = file_info.get("file_name", "TeraBox Video.mp4")
        formatted_size = file_info.get("file_size", "Unknown size")
        thumbnail_url = file_info.get("thumbnail", "")
        encoded_url = urllib.parse.quote(raw_url, safe="")

        # Step 2: Try to get direct PCS CDN stream URL
        direct_stream_url = None
        try:
            pcs_url, _, _ = await asyncio.to_thread(tb_client.fetch_download_url, file_info)
            if pcs_url:
                direct_stream_url = pcs_url
        except Exception:
            pass

        # Player URLs
        surl = file_info.get("surl") or ""
        if not surl:
            if "/s/" in raw_url:
                surl = raw_url.split("/s/")[-1].split("?")[0].split("/")[0]
            elif "surl=" in raw_url:
                surl = raw_url.split("surl=")[-1].split("&")[0]

        # Unblocked Online Player URLs (accessible in India without ISP blocking)
        online_player_url = f"https://teravideo.in/?url={encoded_url}"
        v1_url = direct_stream_url or f"https://playtera.in/?url={encoded_url}"
        v2_url = f"https://teravideo.in/?url={encoded_url}"
        v3_url = f"https://iteraplay.in/?url={encoded_url}"
        how_to_url = online_player_url

        # Step 3: Exact message caption matching the user's template
        caption = (
            f"**Title:** `{file_name}`\n"
            f"**Size:** {formatted_size}\n"
            f"**Download Link V1:** [Link]({v1_url})\n"
            f"**Download Link V2:** [Link]({v2_url})\n"
            f"**Download Link V3:** [Link]({v3_url})\n"
            f"**How To Watch Video:** [Here]({how_to_url})"
        )

        # Step 4: WebApp button (opens player directly inside Telegram!)
        try:
            button = KeyboardInlineButton(
                text="Online Player ▶️",
                type=InlineButtonTypeWebView(url=online_player_url),
            )
            buttons = [[button]]
        except Exception:
            buttons = [[Button.url("Online Player ▶️", online_player_url)]]

        # Step 5: Download thumbnail image locally for preview
        thumb_path = None
        if thumbnail_url:
            thumb_path = await asyncio.to_thread(tb_client.download_thumbnail, thumbnail_url)

        # Send photo with caption and button
        if thumb_path and thumb_path.exists():
            await client.send_file(
                entity=event.chat_id,
                file=thumb_path,
                caption=caption,
                buttons=buttons,
                reply_to=event.id,
            )
            try:
                thumb_path.unlink()
            except Exception:
                pass
        else:
            await event.reply(
                caption,
                buttons=buttons,
            )

        # Remove the temporary status message
        try:
            await status_msg.delete()
        except Exception:
            pass

        logger.info(f"Successfully sent online player card for {file_name} to user {event.sender_id}")

    except Exception as e:
        logger.error(f"Error handling TeraBox link: {e}", exc_info=True)
        try:
            await status_msg.edit(f"❌ **An unexpected error occurred:**\n`{str(e)}`")
        except Exception:
            pass


async def main():
    logger.info("Starting Telegram Bot via Telethon MTProto...")
    await client.start(bot_token=config.BOT_TOKEN)
    me = await client.get_me()
    logger.info(f"Bot connected successfully as @{me.username} ({me.first_name}) [ID: {me.id}]")
    print(f"\n=======================================================")
    print(f"🤖 Bot is ONLINE: @{me.username} ({me.first_name})")
    print(f"🎬 Online Player & Card Mode: Active")
    print(f"=======================================================\n")
    await client.run_until_disconnected()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except (KeyboardInterrupt, SystemExit):
        logger.info("Bot stopped by user.")
