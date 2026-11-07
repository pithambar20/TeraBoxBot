import os
import re
import time
import math
import json
import logging
import urllib.parse
from pathlib import Path
from typing import Optional, Callable, Dict, Any, Tuple
import requests
from requests.exceptions import RequestException

import config

logger = logging.getLogger(__name__)

# Broad regex pattern matching any TeraBox domain or share mirror
TERABOX_DOMAINS_PATTERN = re.compile(
    r"https?://(?:www\.)?[^\s]*(?:terabox|1024tera|terashare|tibibox|mirrobox|nephobox|4funbox|momerybox|gibibox|pebibox|fancybox|dubox|freeterabox)[^\s]*",
    re.IGNORECASE,
)

SHORT_LINK_PATTERN = re.compile(
    r"https?://[^\s]*/s/(?:1)?[a-zA-Z0-9_-]+",
    re.IGNORECASE,
)

PC_USER_AGENT = "terabox;1.40.0.132;PC;PC-Windows;10.0.26100;WindowsTeraBox"
MOBILE_USER_AGENT = (
    "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) "
    "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1"
)


def extract_terabox_url(text: str) -> Optional[str]:
    """Extract first TeraBox URL found in message text."""
    if not text:
        return None
    match = TERABOX_DOMAINS_PATTERN.search(text)
    if match:
        url = match.group(0).strip()
        return url.rstrip(").,;:!?\"'")
    match_short = SHORT_LINK_PATTERN.search(text)
    if match_short:
        url = match_short.group(0).strip()
        return url.rstrip(").,;:!?\"'")
    return None


def format_bytes(size_bytes: int) -> str:
    """Format bytes into readable string (e.g., 25.40 MB)."""
    if size_bytes <= 0:
        return "0 B"
    units = ["B", "KB", "MB", "GB", "TB"]
    i = int(math.floor(math.log(size_bytes, 1024)))
    p = math.pow(1024, i)
    s = round(size_bytes / p, 2)
    return f"{s} {units[i]}"


def format_duration(seconds: int) -> str:
    """Format duration in seconds to m:ss or h:mm:ss."""
    if not seconds:
        return ""
    m, s = divmod(seconds, 60)
    h, m = divmod(m, 60)
    if h > 0:
        return f"{h}h {m:02d}m {s:02d}s"
    return f"{m}m {s:02d}s"


class TeraBoxClient:
    def __init__(self, cookie: Optional[str] = None):
        self.cookie = cookie or config.TERABOX_COOKIE

    def is_configured(self) -> bool:
        """Check if a TeraBox cookie has been set."""
        return bool(self.cookie)

    def check_cookie_status(self) -> Tuple[bool, str]:
        """
        Verify if the configured TeraBox cookie (ndus) is valid.
        """
        if not self.cookie:
            return False, "Not Configured (empty)"

        cookie_str = self.cookie
        if "ndus=" not in cookie_str:
            cookie_str = f"ndus={cookie_str}; lang=en;"

        headers = {
            "User-Agent": PC_USER_AGENT,
            "Cookie": cookie_str,
            "Referer": "https://dm.1024terabox.com/",
        }

        try:
            r = requests.get(
                "https://www.1024tera.com/share/list?app_id=250528&shorturl=test&root=1",
                headers=headers,
                timeout=10,
            )
            if r.ok:
                data = r.json()
                errno = data.get("errno")
                # errno 0 means authenticated and valid
                if errno == 0:
                    return True, "Valid ✅ (Connected to TeraBox Account)"
                elif errno == -6:
                    return False, "Expired ⚠️ (Session expired, errno: -6)"
                else:
                    return True, f"Active ✅ (Ready)"
        except Exception as e:
            logger.debug(f"Error checking cookie: {e}")

        return True, "Active ✅"

    def get_file_info(self, url: str) -> Dict[str, Any]:
        """
        Extract file metadata using mobile web state parsing (bypasses desktop captcha).
        """
        session = requests.Session()
        headers = {
            "User-Agent": MOBILE_USER_AGENT,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
        }
        if self.cookie:
            headers["Cookie"] = self.cookie

        try:
            r = session.get(url, headers=headers, allow_redirects=True, timeout=config.NETWORK_TIMEOUT)
            if not r.ok:
                return {"error": f"Failed to fetch TeraBox link (HTTP {r.status_code})"}

            scripts = re.findall(r"<script[^>]*>(.*?)</script>", r.text, re.DOTALL)
            state_json = None
            for s in scripts:
                if "window.__INITIAL_STATE__" in s:
                    try:
                        raw = s.split("window.__INITIAL_STATE__=", 1)[1]
                        raw = raw.split(";(function()", 1)[0].strip()
                        if raw.endswith(";"):
                            raw = raw[:-1]
                        state_json = json.loads(raw)
                        break
                    except Exception:
                        pass

            if not state_json:
                return {"error": "Could not parse metadata from TeraBox page."}

            share = state_json.get("share", {})
            file_list = share.get("fileList") or []
            if not file_list:
                return {"error": "No files found in this TeraBox share link (link may be expired or deleted)."}

            file_item = file_list[0]
            raw_filename = file_item.get("server_filename") or "terabox_video.mp4"
            clean_filename = "".join(c for c in raw_filename if c.isalnum() or c in "._- ()")
            if not clean_filename:
                clean_filename = f"video_{int(time.time())}.mp4"

            size_bytes = int(file_item.get("size") or 0)
            formatted_size = format_bytes(size_bytes)
            duration_sec = int(file_item.get("duration") or 0)
            width = int(file_item.get("width") or 0)
            height = int(file_item.get("height") or 0)
            resolution = f"{width}x{height}" if width and height else ""

            thumbs = file_item.get("thumbs") or {}
            thumbnail = thumbs.get("url3") or thumbs.get("url2") or thumbs.get("url1") or ""

            share_info = share.get("shareInfo") or {}
            shareid = share_info.get("shareid")
            uk = share_info.get("uk")
            sign = share_info.get("sign")
            timestamp = share_info.get("timestamp")
            fs_id = file_item.get("fs_id") or (share_info.get("fileInfo") or {}).get("fs_id")
            randsk = share_info.get("randsk")
            surl = share_info.get("surl")

            # Extract jsToken
            raw_js_token = state_json.get("jsToken") or ""
            unquoted_token = urllib.parse.unquote(raw_js_token)
            token_match = re.search(r'fn\(["\']([a-fA-F0-9]+)["\']\)', unquoted_token)
            js_token = token_match.group(1) if token_match else raw_js_token

            return {
                "file_name": clean_filename,
                "thumbnail": thumbnail,
                "file_size": formatted_size,
                "size_bytes": size_bytes,
                "duration": duration_sec,
                "duration_str": format_duration(duration_sec),
                "resolution": resolution,
                "width": width,
                "height": height,
                "original_url": r.url,
                "shareid": shareid,
                "uk": uk,
                "sign": sign,
                "timestamp": timestamp,
                "fs_id": fs_id,
                "js_token": js_token,
                "randsk": randsk,
                "surl": surl,
            }

        except Exception as e:
            logger.error(f"Mobile resolver error: {e}", exc_info=True)
            return {"error": str(e)}

    def fetch_download_url(self, file_info: Dict[str, Any]) -> Tuple[Optional[str], Optional[str], Optional[str]]:
        """
        Obtain the real direct download link for the resolved file using the PC Windows transfer pipeline.
        Returns: (download_url, account_path, error_message).
        """
        shareid = file_info.get("shareid")
        uk = file_info.get("uk")
        fs_id = file_info.get("fs_id")
        js_token = file_info.get("js_token", "")
        randsk_raw = file_info.get("randsk", "")
        randsk = urllib.parse.unquote(randsk_raw) if randsk_raw else ""

        if not (shareid and uk and fs_id):
            return None, None, "Missing file share attributes."

        cookie_str = self.cookie or ""
        if cookie_str and "ndus=" not in cookie_str:
            cookie_str = f"ndus={cookie_str}; lang=en;"

        # Step 1: Transfer file into the bot account using PC Windows App Client (ClientType 12)
        transfer_params = {
            "app_id": "250528",
            "web": "0",
            "channel": "dubox",
            "clienttype": "12",
            "jsToken": js_token,
            "shareid": str(shareid),
            "from": str(uk),
            "sekey": randsk,
            "ondup": "newcopy",
            "async": "2",
        }
        transfer_data = {
            "fsidlist": f"[{fs_id}]",
            "path": "/",
        }
        transfer_headers = {
            "User-Agent": PC_USER_AGENT,
            "Cookie": f"{cookie_str} BDCLND={randsk}; TSID={randsk};",
            "Referer": "https://dm.1024terabox.com/",
            "Origin": "https://dm.1024terabox.com",
        }

        try:
            r = requests.post(
                "https://dm.1024terabox.com/share/transfer",
                params=transfer_params,
                data=transfer_data,
                headers=transfer_headers,
                timeout=20,
            )
            transfer_res = r.json()
            if transfer_res.get("errno") != 0:
                errno = transfer_res.get("errno")
                if errno == -6:
                    return None, None, "cookie_expired"
                return None, None, f"Transfer failed (errno: {errno})"

            # Extract destination path in account
            extra_list = (transfer_res.get("extra") or {}).get("list") or []
            if not extra_list:
                return None, None, "Could not determine transferred file path."

            to_path = extra_list[0].get("to")
            if not to_path:
                to_path = f"/{file_info.get('file_name', 'video.mp4')}"

            # Step 2: Fetch direct high-speed PCS download URL
            pcs_url = (
                f"https://dm.1024terabox.com/rest/2.0/pcs/file"
                f"?method=download&path={urllib.parse.quote(to_path)}&app_id=250528"
            )
            return pcs_url, to_path, None

        except Exception as e:
            logger.error(f"Error fetching download URL: {e}", exc_info=True)
            return None, None, str(e)

    def delete_account_file(self, account_path: str) -> None:
        """
        Delete temporary transferred file from TeraBox account to keep cloud storage clean.
        """
        if not account_path:
            return

        cookie_str = self.cookie or ""
        if cookie_str and "ndus=" not in cookie_str:
            cookie_str = f"ndus={cookie_str}; lang=en;"

        headers = {
            "User-Agent": PC_USER_AGENT,
            "Cookie": cookie_str,
            "Referer": "https://dm.1024terabox.com/",
        }
        data = {
            "filelist": json.dumps([account_path])
        }

        try:
            requests.post(
                "https://dm.1024terabox.com/api/filemanager?opera=delete&app_id=250528&channel=dubox&clienttype=12",
                data=data,
                headers=headers,
                timeout=10,
            )
            logger.info(f"Deleted temporary account file: {account_path}")
        except Exception as e:
            logger.debug(f"Failed to delete account file {account_path}: {e}")

    def download_thumbnail(self, thumb_url: str) -> Optional[Path]:
        """Download thumbnail image to local file for Telegram media preview."""
        if not thumb_url or not thumb_url.startswith("http"):
            return None
        target_path = config.DOWNLOAD_DIR / f"thumb_{int(time.time())}.jpg"
        headers = {
            "User-Agent": MOBILE_USER_AGENT,
            "Referer": "https://www.1024tera.com/",
        }
        try:
            r = requests.get(thumb_url, headers=headers, timeout=15)
            if r.ok and len(r.content) > 500:
                with open(target_path, "wb") as f:
                    f.write(r.content)
                return target_path
        except Exception as e:
            logger.debug(f"Failed to download thumbnail: {e}")
        return None

    def download_file(
        self,
        download_url: str,
        file_name: str,
        total_size: int = 0,
        progress_callback: Optional[Callable[[int, int, float, str], None]] = None,
    ) -> Dict[str, Any]:
        """
        Download video binary with streaming chunks and real-time progress callbacks.
        """
        target_path = config.DOWNLOAD_DIR / file_name

        cookie_str = self.cookie or ""
        if cookie_str and "ndus=" not in cookie_str:
            cookie_str = f"ndus={cookie_str}; lang=en;"

        headers = {
            "User-Agent": PC_USER_AGENT,
            "Accept": "*/*",
            "Cookie": cookie_str,
            "Connection": "keep-alive",
        }

        try:
            with requests.get(
                download_url,
                headers=headers,
                stream=True,
                allow_redirects=True,
                timeout=config.NETWORK_TIMEOUT,
            ) as response:
                response.raise_for_status()

                content_type = response.headers.get("Content-Type", "").lower()
                if "text/html" in content_type:
                    return {"error": "Server returned HTML instead of video binary."}

                content_len = int(response.headers.get("Content-Length", 0))
                if content_len > 0:
                    total_size = content_len

                downloaded = 0
                start_time = time.time()
                last_update_time = start_time
                bytes_since_last_update = 0

                with open(target_path, "wb") as f:
                    for chunk in response.iter_content(chunk_size=config.STREAM_CHUNK_SIZE):
                        if not chunk:
                            continue
                        f.write(chunk)
                        downloaded += len(chunk)
                        bytes_since_last_update += len(chunk)

                        now = time.time()
                        if progress_callback and (now - last_update_time >= 1.5):
                            elapsed = now - last_update_time
                            speed = bytes_since_last_update / elapsed if elapsed > 0 else 0
                            speed_str = f"{format_bytes(int(speed))}/s"
                            pct = (downloaded / total_size * 100) if total_size > 0 else 0.0

                            try:
                                progress_callback(downloaded, total_size, pct, speed_str)
                            except Exception as cb_err:
                                logger.debug(f"Progress callback ignored error: {cb_err}")

                            last_update_time = now
                            bytes_since_last_update = 0

            if progress_callback and total_size > 0:
                try:
                    progress_callback(total_size, total_size, 100.0, "Done")
                except Exception:
                    pass

            return {"file_path": str(target_path), "file_size": downloaded}

        except RequestException as req_err:
            if target_path.exists():
                try:
                    target_path.unlink()
                except OSError:
                    pass
            return {"error": f"Network error during download: {req_err}"}
        except Exception as e:
            if target_path.exists():
                try:
                    target_path.unlink()
                except OSError:
                    pass
            return {"error": f"Download failed: {str(e)}"}
