"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Errors: () => errors_exports,
  FileDownloader: () => FileDownloader,
  HLSDownloader: () => HLSDownloader,
  HLSParser: () => HLSParser,
  PACKAGE_NAME: () => PACKAGE_NAME,
  TeraboxAPI: () => TeraboxAPI,
  TeraboxParser: () => TeraboxParser,
  TeraboxXL: () => TeraboxXL,
  Utils: () => utils_exports,
  VERSION: () => VERSION,
  createClient: () => createClient,
  default: () => index_default,
  getTeraboxDownloadLinks: () => getTeraboxDownloadLinks,
  getTeraboxFileInfo: () => getTeraboxFileInfo,
  getTeraboxHLS: () => getTeraboxHLS
});
module.exports = __toCommonJS(index_exports);

// src/utils.ts
var utils_exports = {};
__export(utils_exports, {
  DEFAULT_USER_AGENT: () => DEFAULT_USER_AGENT,
  TERABOX_DOMAINS: () => TERABOX_DOMAINS,
  buildHeaders: () => buildHeaders,
  extractSurlFromUrl: () => extractSurlFromUrl,
  extractWithRegex: () => extractWithRegex,
  findBetween: () => findBetween,
  formatBytes: () => formatBytes,
  isAudioFile: () => isAudioFile,
  isVideoFile: () => isVideoFile,
  parseCookieString: () => parseCookieString,
  retry: () => retry,
  sleep: () => sleep,
  validateTeraboxUrl: () => validateTeraboxUrl
});

// src/errors.ts
var errors_exports = {};
__export(errors_exports, {
  APIError: () => APIError,
  ErrorCodes: () => ErrorCodes,
  HLSError: () => HLSError,
  NetworkError: () => NetworkError,
  ParsingError: () => ParsingError,
  TeraboxXLError: () => TeraboxXLError,
  ValidationError: () => ValidationError
});
var ErrorCodes = {
  E_INVALID_URL: "E_INVALID_URL",
  E_NETWORK_FAIL: "E_NETWORK_FAIL",
  E_PARSING_FAIL: "E_PARSING_FAIL",
  E_API_FAIL: "E_API_FAIL",
  E_TOKEN_MISSING: "E_TOKEN_MISSING",
  E_FILE_NOT_FOUND: "E_FILE_NOT_FOUND",
  E_EXPIRED_LINK: "E_EXPIRED_LINK",
  E_RATE_LIMIT: "E_RATE_LIMIT",
  E_HLS_FAIL: "E_HLS_FAIL",
  E_DOWNLOAD_FAIL: "E_DOWNLOAD_FAIL",
  E_VALIDATION_FAIL: "E_VALIDATION_FAIL",
  E_COOKIE_INVALID: "E_COOKIE_INVALID",
  E_UNSUPPORTED: "E_UNSUPPORTED"
};
var TeraboxXLError = class _TeraboxXLError extends Error {
  code;
  statusCode;
  details;
  timestamp;
  constructor(message, code, statusCode, details) {
    super(message);
    this.name = "TeraboxXLError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = (/* @__PURE__ */ new Date()).toISOString();
    Object.setPrototypeOf(this, _TeraboxXLError.prototype);
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
      timestamp: this.timestamp
    };
  }
};
var NetworkError = class extends TeraboxXLError {
  constructor(message, details) {
    super(message, ErrorCodes.E_NETWORK_FAIL, void 0, details);
    this.name = "NetworkError";
  }
};
var ParsingError = class extends TeraboxXLError {
  constructor(message, details) {
    super(message, ErrorCodes.E_PARSING_FAIL, void 0, details);
    this.name = "ParsingError";
  }
};
var APIError = class extends TeraboxXLError {
  constructor(message, statusCode, details) {
    super(message, ErrorCodes.E_API_FAIL, statusCode, details);
    this.name = "APIError";
  }
};
var ValidationError = class extends TeraboxXLError {
  constructor(message, details) {
    super(message, ErrorCodes.E_VALIDATION_FAIL, void 0, details);
    this.name = "ValidationError";
  }
};
var HLSError = class extends TeraboxXLError {
  constructor(message, details) {
    super(message, ErrorCodes.E_HLS_FAIL, void 0, details);
    this.name = "HLSError";
  }
};

// src/utils.ts
var TERABOX_DOMAINS = [
  "terabox.com",
  "www.terabox.com",
  "terabox.app",
  "www.terabox.app",
  "teraboxapp.com",
  "www.teraboxapp.com",
  "1024tera.com",
  "www.1024tera.com",
  "1024terabox.com",
  "www.1024terabox.com",
  "freeterabox.com",
  "www.freeterabox.com",
  "nephobox.com",
  "www.nephobox.com",
  "mirrobox.com",
  "www.mirrobox.com",
  "momerybox.com",
  "www.momerybox.com",
  "4funbox.com",
  "www.4funbox.com",
  "4funbox.co",
  "tibibox.com",
  "www.tibibox.com",
  "dm.terabox.com",
  "dm.1024tera.com"
];
var DEFAULT_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";
function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const formatted = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
  return `${formatted} ${sizes[i]}`;
}
function extractSurlFromUrl(inputUrl) {
  try {
    const url = new URL(inputUrl);
    const surlParam = url.searchParams.get("surl");
    if (surlParam) return surlParam;
    const match = url.pathname.match(/\/s\/([A-Za-z0-9_-]+)/);
    if (match) return match[1];
    const embedMatch = url.search.match(/surl=([^&]+)/);
    if (embedMatch) return embedMatch[1];
    const segments = url.pathname.split("/").filter(Boolean);
    if (segments.length > 0) {
      const last = segments[segments.length - 1];
      if (last.length >= 8) return last;
    }
    throw new ValidationError(`Cannot extract surl from URL: ${inputUrl}`, {
      code: ErrorCodes.E_INVALID_URL,
      url: inputUrl
    });
  } catch (e) {
    if (e instanceof ValidationError) throw e;
    throw new ValidationError(`Invalid URL format: ${inputUrl}`, {
      originalError: e.message
    });
  }
}
function validateTeraboxUrl(url) {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    return TERABOX_DOMAINS.some(
      (d) => hostname === d || hostname.endsWith(`.${d}`) || hostname.includes(d)
    );
  } catch {
    return false;
  }
}
function findBetween(data, first, last) {
  try {
    const start = data.indexOf(first);
    if (start === -1) return null;
    const startIdx = start + first.length;
    const end = data.indexOf(last, startIdx);
    if (end === -1) return null;
    return data.substring(startIdx, end);
  } catch {
    return null;
  }
}
function extractWithRegex(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function retry(fn, attempts = 3, delay = 1e3, backoff = 2) {
  let lastError;
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
      if (i === attempts) break;
      const waitTime = delay * Math.pow(backoff, i - 1);
      await sleep(waitTime);
    }
  }
  throw lastError;
}
function buildHeaders(cookie, userAgent = DEFAULT_USER_AGENT, extra = {}) {
  const headers = {
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9,id;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
    "User-Agent": userAgent,
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    ...extra
  };
  if (cookie) {
    headers["Cookie"] = cookie.includes("=") ? cookie : `ndus=${cookie}`;
  }
  return headers;
}
function parseCookieString(cookieStr) {
  const cookies = {};
  cookieStr.split(";").forEach((part) => {
    const [k, ...v] = part.trim().split("=");
    if (k) cookies[k.trim()] = v.join("=").trim();
  });
  return cookies;
}
function isVideoFile(filename) {
  const ext = filename.toLowerCase().split(".").pop() || "";
  return ["mp4", "mkv", "avi", "mov", "flv", "webm", "m4v", "mpg", "mpeg", "3gp"].includes(ext);
}
function isAudioFile(filename) {
  const ext = filename.toLowerCase().split(".").pop() || "";
  return ["mp3", "wav", "flac", "aac", "ogg", "m4a", "wma"].includes(ext);
}

// src/parser.ts
var TeraboxParser = class {
  /**
   * Extract all required tokens from share page HTML
   * This is the core of Terabox scraping - real parsing
   */
  static extractTokens(html, finalUrl) {
    const dpLogIdPatterns = [
      /dp-logid=([^&"']+)/,
      /dpLogId["']?\s*[:=]\s*["']([^"']+)["']/,
      /"dp-logid":\s*"([^"]+)"/
    ];
    const dpLogId = extractWithRegex(html, dpLogIdPatterns);
    const jsTokenPatterns = [
      /fn%28%22([a-f0-9]+)%22%29/,
      // original encoding fn("token")
      /"jsToken"\s*:\s*"([a-f0-9]+)"/,
      /jsToken["']?\s*[:=]\s*["']([a-f0-9]+)["']/,
      /window\.jsToken\s*=\s*['"]([^'"]+)['"]/,
      /`jsToken`\s*:\s*['"]([^'"]+)['"]/,
      /jsToken\s*=\s*['"]([a-zA-Z0-9]+)['"]/
    ];
    const jsToken = extractWithRegex(html, jsTokenPatterns);
    const bdstokenPatterns = [
      /bdstoken["']?\s*[:=]\s*["']([^"']+)["']/,
      /"bdstoken"\s*:\s*"([^"]+)"/
    ];
    const bdstoken = extractWithRegex(html, bdstokenPatterns) || void 0;
    let shorturl = "";
    try {
      const u = new URL(finalUrl);
      shorturl = u.searchParams.get("surl") || "";
      if (!shorturl) {
        const m = finalUrl.match(/\/s\/([A-Za-z0-9_-]+)/);
        if (m) shorturl = m[1];
      }
      if (!shorturl) {
        shorturl = extractWithRegex(html, [/shorturl["']?\s*[:=]\s*["']([^"']+)["']/, /"shorturl"\s*:\s*"([^"]+)"/]) || "";
      }
    } catch {
    }
    const defaultThumbnail = findBetween(html, 'og:image" content="', '"') || findBetween(html, "og:image' content='", "'") || findBetween(html, '<meta property="og:image" content="', '"') || void 0;
    const sekey = extractWithRegex(html, [/sekey["']?\s*[:=]\s*["']([^"']+)["']/, /"sekey"\s*:\s*"([^"]+)"/]) || void 0;
    if (!jsToken) {
      const aggressiveJsToken = html.match(/[a-f0-9]{32,}/g)?.[0];
      if (aggressiveJsToken && aggressiveJsToken.length >= 32) {
        return {
          jsToken: aggressiveJsToken,
          dpLogId: dpLogId || "",
          bdstoken,
          shorturl,
          defaultThumbnail,
          sekey,
          logid: dpLogId || void 0
        };
      }
      throw new ParsingError("Failed to extract jsToken from HTML - Terabox page structure changed", {
        code: ErrorCodes.E_PARSING_FAIL,
        hasDpLogId: !!dpLogId,
        htmlSnippet: html.substring(0, 2e3),
        finalUrl
      });
    }
    if (!dpLogId) {
      throw new ParsingError("Failed to extract dp-logid (required for API)", {
        code: ErrorCodes.E_PARSING_FAIL,
        jsTokenFound: !!jsToken,
        finalUrl
      });
    }
    if (!shorturl) {
      throw new ParsingError("Failed to extract shorturl/surl", {
        code: ErrorCodes.E_PARSING_FAIL,
        finalUrl
      });
    }
    return {
      jsToken,
      dpLogId,
      bdstoken,
      shorturl,
      defaultThumbnail,
      sekey,
      logid: dpLogId
    };
  }
  /**
   * Parse file list from API JSON
   */
  static parseFileList(apiJson) {
    if (apiJson.errno && apiJson.errno !== 0) {
      throw new ParsingError(`Terabox API returned error errno=${apiJson.errno}`, {
        errno: apiJson.errno,
        errmsg: apiJson.errmsg || apiJson.error || "unknown",
        fullResponse: apiJson
      });
    }
    const list = apiJson.list || apiJson.data?.list || apiJson.info || [];
    if (!Array.isArray(list) || list.length === 0) {
      throw new ParsingError("No files found in API response - link may be expired or private", {
        code: ErrorCodes.E_FILE_NOT_FOUND,
        response: apiJson
      });
    }
    return {
      list,
      extra: {
        shareid: apiJson.shareid || apiJson.data?.shareid,
        uk: apiJson.uk || apiJson.data?.uk,
        sign: apiJson.sign || apiJson.data?.sign,
        timestamp: apiJson.timestamp || apiJson.data?.timestamp,
        ...apiJson
      }
    };
  }
  /**
   * Extract HLS qualities from streaming API or page
   */
  static extractHLSQualities(m3u8MasterContent, baseUrl) {
    const qualities = [];
    const lines = m3u8MasterContent.split("\n");
    let currentBandwidth;
    let currentResolution;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith("#EXT-X-STREAM-INF")) {
        const bwMatch = line.match(/BANDWIDTH=(\d+)/);
        if (bwMatch) currentBandwidth = parseInt(bwMatch[1], 10);
        const resMatch = line.match(/RESOLUTION=(\d+)x(\d+)/);
        if (resMatch) {
          currentResolution = { width: parseInt(resMatch[1]), height: parseInt(resMatch[2]) };
        }
        const nextLine = lines[i + 1]?.trim();
        if (nextLine && !nextLine.startsWith("#")) {
          let quality = "unknown";
          if (currentResolution) {
            if (currentResolution.height <= 360) quality = "360p";
            else if (currentResolution.height <= 480) quality = "480p";
            else if (currentResolution.height <= 720) quality = "720p";
            else if (currentResolution.height <= 1080) quality = "1080p";
            else quality = "4K";
          }
          const typeMap = {
            "360p": "M3U8_AUTO_360",
            "480p": "M3U8_AUTO_480",
            "720p": "M3U8_AUTO_720",
            "1080p": "M3U8_AUTO_1080",
            "4K": "M3U8_AUTO_1440"
          };
          const resolvedUrl = nextLine.startsWith("http") ? nextLine : new URL(nextLine, baseUrl).toString();
          qualities.push({
            quality,
            type: typeMap[quality] || `M3U8_AUTO_${quality.toUpperCase()}`,
            url: resolvedUrl,
            bandwidth: currentBandwidth,
            resolution: currentResolution
          });
        }
      }
    }
    if (qualities.length === 0 && m3u8MasterContent.includes("#EXTINF")) {
      qualities.push({
        quality: "360p",
        type: "M3U8_AUTO_360",
        url: baseUrl,
        bandwidth: void 0,
        resolution: void 0
      });
    }
    return qualities;
  }
};

// src/api.ts
var TeraboxAPI = class {
  cookie;
  userAgent;
  timeout;
  retries;
  retryDelay;
  verbose;
  extraHeaders;
  constructor(options = {}) {
    this.cookie = options.cookie;
    this.userAgent = options.userAgent || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";
    this.timeout = options.timeout || 15e3;
    this.retries = options.retries || 3;
    this.retryDelay = options.retryDelay || 1e3;
    this.verbose = options.verbose || false;
    this.extraHeaders = options.headers || {};
  }
  log(...args) {
    if (this.verbose) console.log("[TeraboxXL]", ...args);
  }
  /**
   * Fetch with timeout and retry - REAL network call
   */
  async fetchWithRetry(url, options = {}, attempt = 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...buildHeaders(this.cookie, this.userAgent, this.extraHeaders),
          ...options.headers
        }
      });
      clearTimeout(timeoutId);
      if (response.status === 429) {
        throw new APIError("Rate limited by Terabox", 429, { url });
      }
      if (response.status >= 500 && attempt < this.retries) {
        this.log(`Retry ${attempt}/${this.retries} for ${url} due to ${response.status}`);
        await sleep(this.retryDelay * attempt);
        return this.fetchWithRetry(url, options, attempt + 1);
      }
      return response;
    } catch (e) {
      clearTimeout(timeoutId);
      if (e.name === "AbortError") {
        if (attempt < this.retries) {
          this.log(`Timeout retry ${attempt}/${this.retries} for ${url}`);
          await sleep(this.retryDelay * attempt);
          return this.fetchWithRetry(url, options, attempt + 1);
        }
        throw new NetworkError(`Request timeout for ${url}`, { url, timeout: this.timeout });
      }
      if (attempt < this.retries) {
        await sleep(this.retryDelay * attempt);
        return this.fetchWithRetry(url, options, attempt + 1);
      }
      throw new NetworkError(`Network error for ${url}: ${e.message}`, { url, originalError: e.message });
    }
  }
  /**
   * Get share page HTML and extract tokens
   */
  async getTokensFromSharePage(shareUrl) {
    if (!validateTeraboxUrl(shareUrl)) {
      throw new ValidationError(`Invalid Terabox URL: ${shareUrl}. Supported domains: terabox.com, 1024tera.com, etc`, {
        url: shareUrl
      });
    }
    const surl = extractSurlFromUrl(shareUrl);
    this.log(`Extracted surl: ${surl} from ${shareUrl}`);
    const sharePageCandidates = [
      `https://www.terabox.com/sharing/link?surl=${surl}`,
      `https://www.terabox.app/sharing/link?surl=${surl}`,
      `https://www.1024tera.com/sharing/link?surl=${surl}`,
      `https://dm.terabox.com/sharing/link?surl=${surl}`
    ];
    let lastError;
    for (const pageUrl of sharePageCandidates) {
      try {
        this.log(`Trying share page: ${pageUrl}`);
        const response = await this.fetchWithRetry(pageUrl, { method: "GET" });
        if (!response.ok) {
          lastError = new APIError(`Share page returned ${response.status}`, response.status, { pageUrl });
          continue;
        }
        const html = await response.text();
        const finalUrl = response.url;
        const setCookieHeader = response.headers.get("set-cookie") || "";
        const cookies = {};
        if (setCookieHeader) {
          setCookieHeader.split(",").forEach((c) => {
            const parts = c.split(";")[0].split("=");
            if (parts.length === 2) cookies[parts[0].trim()] = parts[1].trim();
          });
        }
        if (this.cookie) {
          Object.assign(cookies, parseCookieString(this.cookie));
        }
        try {
          const tokens = TeraboxParser.extractTokens(html, finalUrl);
          this.log(`Tokens extracted: jsToken=${tokens.jsToken.substring(0, 8)}..., dpLogId=${tokens.dpLogId.substring(0, 8)}...`);
          return { html, tokens, finalUrl, cookies };
        } catch (parseErr) {
          lastError = parseErr;
          if (html.includes("expired") || html.includes("not found") || html.includes("404")) {
            throw new APIError("Terabox share link expired or not found", 404, { surl, pageUrl });
          }
          continue;
        }
      } catch (e) {
        lastError = e;
        continue;
      }
    }
    throw lastError || new APIError("Failed to get tokens from all share page candidates", 0, { surl });
  }
  /**
   * Get file list from share/list API
   */
  async getFileList(surl, tokens, dir) {
    const baseUrls = [
      "https://www.terabox.app",
      "https://www.terabox.com",
      "https://dm.terabox.com",
      "https://www.1024tera.com"
    ];
    const params = new URLSearchParams({
      app_id: "250528",
      web: "1",
      channel: "dubox",
      clienttype: "0",
      jsToken: tokens.jsToken,
      "dp-logid": tokens.dpLogId,
      page: "1",
      num: "100",
      by: "name",
      order: "asc",
      shorturl: tokens.shorturl || surl,
      root: dir ? "0" : "1",
      ...dir ? { dir } : {}
    });
    let lastError;
    for (const base of baseUrls) {
      const apiUrl = `${base}/share/list?${params.toString()}`;
      try {
        this.log(`Calling file list API: ${apiUrl}`);
        const response = await this.fetchWithRetry(apiUrl, {
          method: "GET",
          headers: {
            Referer: `https://www.terabox.com/sharing/link?surl=${surl}`
          }
        });
        if (!response.ok) {
          lastError = new APIError(`File list API returned ${response.status}`, response.status, { apiUrl });
          continue;
        }
        const json = await response.json();
        if (json.errno && json.errno !== 0) {
          if (json.errno === 2 || json.errno === -9) {
            throw new APIError("Link expired or requires password", json.errno, json);
          }
          lastError = new APIError(`API error errno=${json.errno}: ${json.errmsg || "unknown"}`, json.errno, json);
          continue;
        }
        const { list, extra } = TeraboxParser.parseFileList(json);
        return { list, shareInfo: extra };
      } catch (e) {
        lastError = e;
        continue;
      }
    }
    throw lastError || new APIError("Failed to fetch file list from all endpoints", 0, { surl });
  }
  /**
   * Resolve dlink to real direct CDN link via HEAD
   */
  async resolveDirectLink(dlink) {
    try {
      this.log(`Resolving dlink: ${dlink.substring(0, 80)}...`);
      const response = await this.fetchWithRetry(dlink, {
        method: "HEAD",
        redirect: "manual"
      });
      const location = response.headers.get("location");
      if (location) {
        this.log(`Resolved to: ${location.substring(0, 80)}...`);
        return location;
      }
      const response2 = await this.fetchWithRetry(dlink, { method: "GET", redirect: "follow" });
      const finalUrl = response2.url;
      if (finalUrl && finalUrl !== dlink) {
        return finalUrl;
      }
      return dlink;
    } catch (e) {
      this.log(`Failed to resolve dlink, returning original: ${e.message}`);
      return dlink;
    }
  }
  /**
   * Get file info complete flow
   */
  async getShareInfo(shareUrl) {
    const surl = extractSurlFromUrl(shareUrl);
    const { tokens, cookies } = await this.getTokensFromSharePage(shareUrl);
    const { list, shareInfo } = await this.getFileList(surl, tokens);
    const resolvedList = await Promise.all(
      list.map(async (item) => {
        let directLink = item.dlink;
        try {
          directLink = await this.resolveDirectLink(item.dlink);
        } catch {
        }
        return {
          fs_id: item.fs_id,
          server_filename: item.server_filename,
          size: item.size,
          size_formatted: this.formatSize(item.size),
          isdir: item.isdir,
          category: item.category,
          dlink: item.dlink,
          direct_link: directLink,
          path: item.path,
          thumbs: item.thumbs,
          md5: item.md5,
          server_ctime: item.server_ctime,
          server_mtime: item.server_mtime
        };
      })
    );
    return {
      shareid: shareInfo.shareid || shareInfo.data?.shareid || 0,
      uk: shareInfo.uk || shareInfo.data?.uk || 0,
      sign: shareInfo.sign || shareInfo.data?.sign || "",
      timestamp: shareInfo.timestamp || shareInfo.data?.timestamp || 0,
      bdstoken: tokens.bdstoken,
      jsToken: tokens.jsToken,
      dpLogId: tokens.dpLogId,
      shorturl: tokens.shorturl,
      surl,
      isFolder: list.length > 1 || list.some((f) => f.isdir === 1),
      title: shareInfo.title,
      list: resolvedList,
      extra: { ...shareInfo, cookies, sekey: tokens.sekey || cookies["BOXCLND"] || "" }
    };
  }
  formatSize(bytes) {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }
  /**
   * Try to get HLS streaming URL for a file
   * Uses multiple endpoints fallback
   */
  async getHLSStreamUrl(shareInfo, fsId, qualityType = "M3U8_AUTO_720") {
    const sekey = shareInfo.extra?.sekey || shareInfo.extra?.cookies?.BOXCLND || "";
    const endpoints = [
      `https://www.terabox.com/share/streaming?shareid=${shareInfo.shareid}&uk=${shareInfo.uk}&sign=${shareInfo.sign}&timestamp=${shareInfo.timestamp}&fid=${fsId}&fs_id=${fsId}&type=${qualityType}&channel=dubox&clienttype=0&sekey=${encodeURIComponent(sekey)}&dp-logid=${shareInfo.dpLogId}`,
      `https://www.terabox.app/share/streaming?shareid=${shareInfo.shareid}&uk=${shareInfo.uk}&sign=${shareInfo.sign}&timestamp=${shareInfo.timestamp}&fid=${fsId}&fs_id=${fsId}&type=${qualityType}&channel=dubox&clienttype=0&sekey=${encodeURIComponent(sekey)}&dp-logid=${shareInfo.dpLogId}`
    ];
    for (const url of endpoints) {
      try {
        this.log(`Trying HLS endpoint: ${url.substring(0, 120)}...`);
        const response = await this.fetchWithRetry(url, { method: "GET" });
        if (!response.ok) continue;
        const text = await response.text();
        try {
          const json = JSON.parse(text);
          if (json.dlink || json.url || json.m3u8) {
            return json.dlink || json.url || json.m3u8;
          }
          if (json.errno === 0 && json.info) {
            return json.info.dlink || json.info.url;
          }
        } catch {
          if (text.includes("#EXTM3U")) {
            return url;
          }
          if (text.startsWith("https://") && text.includes(".m3u8")) {
            return text.trim();
          }
        }
      } catch (e) {
        this.log(`HLS endpoint failed: ${e.message}`);
        continue;
      }
    }
    throw new APIError(`Failed to get HLS stream for fs_id ${fsId} with quality ${qualityType}. This file may not support HLS or requires premium cookie.`, 0, {
      fsId,
      qualityType,
      shareInfo
    });
  }
  /**
   * Get all HLS qualities for a file
   */
  async getAllHLSQualities(shareInfo, fsId, filename) {
    const qualityTypes = ["M3U8_AUTO_360", "M3U8_AUTO_480", "M3U8_AUTO_720", "M3U8_AUTO_1080"];
    const results = [];
    for (const type of qualityTypes) {
      try {
        const url = await this.getHLSStreamUrl(shareInfo, fsId, type);
        const quality = type.replace("M3U8_AUTO_", "") + "p";
        results.push({ quality, type, url });
        await sleep(300);
      } catch (e) {
        this.log(`Quality ${type} not available: ${e.message}`);
        continue;
      }
    }
    if (results.length === 0) {
      throw new APIError("No HLS qualities available for this file", 0, { fsId, filename });
    }
    return results;
  }
};

// src/downloader.ts
var fs = __toESM(require("fs"));
var path = __toESM(require("path"));
var FileDownloader = class {
  defaultTimeout;
  defaultHeaders;
  constructor(options = {}) {
    this.defaultTimeout = options.timeout || 3e4;
    this.defaultHeaders = options.headers || {};
  }
  /**
   * Download direct file with progress - REAL implementation
   */
  async downloadFile(url, outputPath, options = {}) {
    const timeout = options.timeout || this.defaultTimeout;
    const headers = { ...this.defaultHeaders, ...options.headers || {} };
    const onProgress = options.onProgress;
    const overwrite = options.overwrite ?? true;
    if (fs.existsSync(outputPath) && !overwrite) {
      throw new ValidationError(`File already exists: ${outputPath} (overwrite=false)`, { outputPath });
    }
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, {
        method: "GET",
        headers,
        signal: controller.signal
      });
      if (!response.ok) {
        throw new NetworkError(`Download failed: ${response.status} ${response.statusText}`, {
          url,
          status: response.status
        });
      }
      const totalBytes = parseInt(response.headers.get("content-length") || "0", 10) || 0;
      const fileStream = fs.createWriteStream(outputPath);
      if (!response.body) {
        throw new NetworkError("Response body is null", { url });
      }
      const reader = response.body.getReader();
      let downloadedBytes = 0;
      const startTime = Date.now();
      let lastProgressTime = startTime;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          fileStream.write(Buffer.from(value));
          downloadedBytes += value.length;
          if (onProgress && Date.now() - lastProgressTime > 200) {
            const elapsed = (Date.now() - startTime) / 1e3;
            const speed = elapsed > 0 ? downloadedBytes / elapsed : 0;
            const percent = totalBytes > 0 ? downloadedBytes / totalBytes * 100 : 0;
            const eta = speed > 0 && totalBytes > 0 ? (totalBytes - downloadedBytes) / speed : 0;
            onProgress({
              downloadedBytes,
              totalBytes,
              percent,
              speed,
              eta,
              filename: path.basename(outputPath)
            });
            lastProgressTime = Date.now();
          }
        }
      }
      fileStream.end();
      await new Promise((resolve, reject) => {
        fileStream.on("finish", resolve);
        fileStream.on("error", reject);
      });
      if (onProgress) {
        const elapsed = (Date.now() - startTime) / 1e3;
        onProgress({
          downloadedBytes,
          totalBytes: totalBytes || downloadedBytes,
          percent: 100,
          speed: elapsed > 0 ? downloadedBytes / elapsed : 0,
          eta: 0,
          filename: path.basename(outputPath)
        });
      }
      return outputPath;
    } catch (e) {
      if (e.name === "AbortError") {
        throw new NetworkError(`Download timeout after ${timeout}ms: ${url}`, { url, timeout });
      }
      throw e;
    } finally {
      clearTimeout(timeoutId);
    }
  }
  /**
   * Get file size via HEAD
   */
  async getFileSize(url, headers = {}) {
    try {
      const res = await fetch(url, { method: "HEAD", headers: { ...this.defaultHeaders, ...headers } });
      const len = res.headers.get("content-length");
      return len ? parseInt(len, 10) : 0;
    } catch {
      return 0;
    }
  }
  /**
   * Batch download multiple files
   */
  async downloadBatch(files, options = {}) {
    const concurrency = options.concurrency || 3;
    const results = [];
    const queue = [...files];
    const worker = async () => {
      while (queue.length > 0) {
        const file = queue.shift();
        if (!file) break;
        const result = await this.downloadFile(file.url, file.outputPath, options);
        results.push(result);
      }
    };
    const workers = Array.from({ length: Math.min(concurrency, files.length) }, () => worker());
    await Promise.all(workers);
    return results;
  }
};

// src/hls.ts
var fs2 = __toESM(require("fs"));
var path2 = __toESM(require("path"));
var HLSParser = class _HLSParser {
  static parseM3U8(content, baseUrl) {
    const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);
    const segments = [];
    let version;
    let targetDuration;
    let mediaSequence;
    let playlistType;
    let isVOD = false;
    let isLive = false;
    let currentDuration = 0;
    let currentTitle;
    let currentByteRange;
    let discontinuity = false;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith("#EXT-X-VERSION:")) {
        version = parseInt(line.split(":")[1], 10);
      } else if (line.startsWith("#EXT-X-TARGETDURATION:")) {
        targetDuration = parseInt(line.split(":")[1], 10);
      } else if (line.startsWith("#EXT-X-MEDIA-SEQUENCE:")) {
        mediaSequence = parseInt(line.split(":")[1], 10);
      } else if (line.startsWith("#EXT-X-PLAYLIST-TYPE:")) {
        playlistType = line.split(":")[1];
        if (playlistType === "VOD") isVOD = true;
      } else if (line.startsWith("#EXTINF:")) {
        const match = line.match(/#EXTINF:([\d.]+)/);
        if (match) currentDuration = parseFloat(match[1]);
        currentTitle = line.split(",")[1]?.trim();
      } else if (line.startsWith("#EXT-X-BYTERANGE:")) {
        currentByteRange = line.split(":")[1];
      } else if (line.startsWith("#EXT-X-DISCONTINUITY")) {
        discontinuity = true;
      } else if (line.startsWith("#EXT-X-ENDLIST")) {
        isVOD = true;
      } else if (!line.startsWith("#") && line.length > 0) {
        let uri = line;
        if (!uri.startsWith("http")) {
          try {
            uri = new URL(uri, baseUrl).toString();
          } catch {
          }
        }
        segments.push({
          uri,
          duration: currentDuration,
          title: currentTitle,
          byteRange: currentByteRange,
          discontinuity
        });
        currentDuration = 0;
        currentTitle = void 0;
        currentByteRange = void 0;
        discontinuity = false;
      }
    }
    if (segments.length === 0 && !content.includes("#EXTM3U")) {
      throw new HLSError("Invalid M3U8 content, no segments found", { contentSnippet: content.substring(0, 500) });
    }
    if (!isVOD && !content.includes("#EXT-X-ENDLIST")) {
      isLive = true;
    }
    return {
      version,
      targetDuration,
      mediaSequence,
      playlistType,
      segments,
      isVOD,
      isLive
    };
  }
  static async fetchAndParse(url, headers = {}) {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new NetworkError(`Failed to fetch M3U8: ${response.status} ${response.statusText}`, { url, status: response.status });
    }
    const content = await response.text();
    const manifest = _HLSParser.parseM3U8(content, response.url || url);
    return { manifest, content, finalUrl: response.url || url };
  }
};
var HLSDownloader = class {
  concurrency;
  timeout;
  headers;
  constructor(options = {}) {
    this.concurrency = options.concurrency || 5;
    this.timeout = options.timeout || 15e3;
    this.headers = options.headers || {};
  }
  /**
   * Download HLS stream to file - REAL implementation
   */
  async download(m3u8Url, outputPath, options = {}) {
    const onProgress = options.onProgress;
    const concurrency = options.concurrency || this.concurrency;
    let manifest;
    let m3u8Content;
    let finalUrl;
    try {
      const result = await HLSParser.fetchAndParse(m3u8Url, { ...this.headers, ...options.headers || {} });
      manifest = result.manifest;
      m3u8Content = result.content;
      finalUrl = result.finalUrl;
    } catch (e) {
      throw new HLSError(`Failed to fetch/parse M3U8: ${e.message}`, { m3u8Url, error: e.message });
    }
    if (m3u8Content.includes("#EXT-X-STREAM-INF") && manifest.segments.length === 0) {
      const lines = m3u8Content.split("\n");
      let bestUrl = null;
      let maxBandwidth = 0;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith("#EXT-X-STREAM-INF")) {
          const bwMatch = line.match(/BANDWIDTH=(\d+)/);
          const bw = bwMatch ? parseInt(bwMatch[1], 10) : 0;
          const nextLine = lines[i + 1]?.trim();
          if (nextLine && !nextLine.startsWith("#")) {
            if (bw >= maxBandwidth) {
              maxBandwidth = bw;
              bestUrl = nextLine.startsWith("http") ? nextLine : new URL(nextLine, finalUrl).toString();
            }
          }
        }
      }
      if (bestUrl) {
        console.log(`[HLS] Master playlist detected, switching to best quality: ${bestUrl}`);
        return this.download(bestUrl, outputPath, options);
      }
    }
    if (manifest.segments.length === 0) {
      throw new HLSError("No segments found in M3U8", { m3u8Url, contentSnippet: m3u8Content.substring(0, 500) });
    }
    const totalSegments = manifest.segments.length;
    const totalDuration = manifest.segments.reduce((sum, s) => sum + s.duration, 0);
    console.log(`[HLS] Manifest parsed: ${totalSegments} segments, ${totalDuration.toFixed(2)}s total, VOD=${manifest.isVOD}, Live=${manifest.isLive}`);
    const dir = path2.dirname(outputPath);
    if (!fs2.existsSync(dir)) {
      fs2.mkdirSync(dir, { recursive: true });
    }
    const tempDir = `${outputPath}.hls_tmp_${Date.now()}`;
    fs2.mkdirSync(tempDir, { recursive: true });
    const segmentPaths = new Array(totalSegments);
    let downloadedBytes = 0;
    let downloadedSegments = 0;
    const startTime = Date.now();
    const downloadSegment = async (index) => {
      const seg = manifest.segments[index];
      const segPath = path2.join(tempDir, `seg_${String(index).padStart(5, "0")}.ts`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      try {
        const res = await fetch(seg.uri, {
          headers: { ...this.headers, ...options.headers || {} },
          signal: controller.signal
        });
        if (!res.ok) throw new Error(`Segment ${index} failed: ${res.status}`);
        const buffer = Buffer.from(await res.arrayBuffer());
        fs2.writeFileSync(segPath, buffer);
        downloadedBytes += buffer.length;
        downloadedSegments++;
        if (onProgress) {
          const elapsed = (Date.now() - startTime) / 1e3;
          const speed = elapsed > 0 ? downloadedBytes / elapsed : 0;
          const percent = downloadedSegments / totalSegments * 100;
          const remainingSegments = totalSegments - downloadedSegments;
          const avgTimePerSeg = elapsed / downloadedSegments;
          const eta = remainingSegments * avgTimePerSeg;
          onProgress({
            downloadedBytes,
            totalBytes: totalSegments,
            // approximation, we use segment count as total
            percent,
            speed,
            eta,
            filename: path2.basename(outputPath)
          });
        }
        segmentPaths[index] = segPath;
      } finally {
        clearTimeout(timeoutId);
      }
    };
    const queue = Array.from({ length: totalSegments }, (_, i) => i);
    const workers = [];
    const worker = async () => {
      while (queue.length > 0) {
        const idx = queue.shift();
        if (idx === void 0) break;
        await downloadSegment(idx);
      }
    };
    for (let i = 0; i < Math.min(concurrency, totalSegments); i++) {
      workers.push(worker());
    }
    await Promise.all(workers);
    console.log(`[HLS] All ${totalSegments} segments downloaded, merging to ${outputPath}`);
    const writeStream = fs2.createWriteStream(outputPath);
    for (let i = 0; i < totalSegments; i++) {
      const segPath = segmentPaths[i];
      if (!segPath || !fs2.existsSync(segPath)) {
        throw new HLSError(`Missing segment file: ${segPath} at index ${i}`);
      }
      const data = fs2.readFileSync(segPath);
      writeStream.write(data);
    }
    writeStream.end();
    await new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });
    fs2.rmSync(tempDir, { recursive: true, force: true });
    console.log(`[HLS] Download complete: ${outputPath} (${(downloadedBytes / 1024 / 1024).toFixed(2)} MB)`);
    return outputPath;
  }
  /**
   * Create a readable stream for HLS (for piping)
   * Simplified version - downloads and pipes
   */
  createReadStream(m3u8Url, options = {}) {
    const { Readable } = require("stream");
    const readable = new Readable({
      read() {
      }
    });
    (async () => {
      try {
        const result = await HLSParser.fetchAndParse(m3u8Url, { ...this.headers, ...options.headers || {} });
        let manifest = result.manifest;
        let finalUrl = result.finalUrl;
        if (result.content.includes("#EXT-X-STREAM-INF")) {
          const lines = result.content.split("\n");
          let bestUrl = null;
          let maxBw = 0;
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith("#EXT-X-STREAM-INF")) {
              const bwMatch = line.match(/BANDWIDTH=(\d+)/);
              const bw = bwMatch ? parseInt(bwMatch[1], 10) : 0;
              const next = lines[i + 1]?.trim();
              if (next && !next.startsWith("#") && bw >= maxBw) {
                maxBw = bw;
                bestUrl = next.startsWith("http") ? next : new URL(next, finalUrl).toString();
              }
            }
          }
          if (bestUrl) {
            const r2 = await HLSParser.fetchAndParse(bestUrl, { ...this.headers, ...options.headers || {} });
            manifest = r2.manifest;
            finalUrl = r2.finalUrl;
          }
        }
        for (const seg of manifest.segments) {
          const res = await fetch(seg.uri, { headers: { ...this.headers, ...options.headers || {} } });
          if (!res.ok) throw new Error(`Segment fetch failed ${res.status}`);
          const buf = Buffer.from(await res.arrayBuffer());
          readable.push(buf);
        }
        readable.push(null);
      } catch (e) {
        readable.emit("error", e);
        readable.push(null);
      }
    })();
    return readable;
  }
};

// src/client.ts
var TeraboxXL = class {
  api;
  fileDownloader;
  hlsDownloader;
  options;
  constructor(options = {}) {
    this.options = {
      timeout: 15e3,
      retries: 3,
      retryDelay: 1e3,
      verbose: false,
      ...options
    };
    this.api = new TeraboxAPI({
      cookie: this.options.cookie,
      userAgent: this.options.userAgent,
      timeout: this.options.timeout,
      retries: this.options.retries,
      retryDelay: this.options.retryDelay,
      verbose: this.options.verbose,
      headers: this.options.headers
    });
    this.fileDownloader = new FileDownloader({
      timeout: this.options.timeout,
      headers: this.options.headers
    });
    this.hlsDownloader = new HLSDownloader({
      timeout: this.options.timeout,
      headers: this.options.headers
    });
  }
  /**
   * Validate URL
   */
  validateUrl(url) {
    try {
      if (!validateTeraboxUrl(url)) {
        return {
          success: false,
          error: {
            code: ErrorCodes.E_INVALID_URL,
            message: `Invalid Terabox URL: ${url}`
          }
        };
      }
      return { success: true, data: true };
    } catch (e) {
      return {
        success: false,
        error: {
          code: ErrorCodes.E_VALIDATION_FAIL,
          message: e.message
        }
      };
    }
  }
  /**
   * Extract surl
   */
  getSurl(url) {
    return extractSurlFromUrl(url);
  }
  /**
   * Get full share info - THE CORE
   */
  async getInfo(shareUrl) {
    try {
      if (!validateTeraboxUrl(shareUrl)) {
        throw new ValidationError(`Invalid Terabox URL: ${shareUrl}`);
      }
      const info = await this.api.getShareInfo(shareUrl);
      return {
        success: true,
        data: info
      };
    } catch (e) {
      const err = e;
      return {
        success: false,
        error: {
          code: err.code || ErrorCodes.E_API_FAIL,
          message: err.message,
          details: err.details || err.toJSON?.() || {}
        }
      };
    }
  }
  /**
   * Get file list only (simplified)
   */
  async getFileList(shareUrl) {
    const res = await this.getInfo(shareUrl);
    if (!res.success || !res.data) {
      return res;
    }
    return {
      success: true,
      data: res.data.list
    };
  }
  /**
   * Get direct download links for all files
   */
  async getDownloadLinks(shareUrl) {
    const res = await this.getInfo(shareUrl);
    if (!res.success || !res.data) {
      return res;
    }
    const links = res.data.list.map((f) => ({
      filename: f.server_filename,
      direct_link: f.direct_link || f.dlink,
      size: f.size,
      size_formatted: f.size_formatted || `${(f.size / 1024 / 1024).toFixed(2)} MB`
    }));
    return { success: true, data: links };
  }
  /**
   * Get HLS info for video files - POWERFUL FEATURE
   */
  async getHLSInfo(shareUrl, fsId) {
    try {
      const infoRes = await this.getInfo(shareUrl);
      if (!infoRes.success || !infoRes.data) {
        return infoRes;
      }
      const shareInfo = infoRes.data;
      let targetFile;
      if (fsId) {
        targetFile = shareInfo.list.find((f) => String(f.fs_id) === String(fsId));
      } else {
        targetFile = shareInfo.list.find((f) => isVideoFile(f.server_filename));
        if (!targetFile) {
          targetFile = shareInfo.list[0];
        }
      }
      if (!targetFile) {
        throw new ValidationError("No file found for HLS extraction", { fsId });
      }
      if (!isVideoFile(targetFile.server_filename)) {
        console.warn(`[TeraboxXL] File ${targetFile.server_filename} may not be video, but trying HLS anyway`);
      }
      const qualities = await this.api.getAllHLSQualities(shareInfo, targetFile.fs_id, targetFile.server_filename);
      const hlsInfo = {
        shareid: shareInfo.shareid,
        uk: shareInfo.uk,
        fs_id: targetFile.fs_id,
        filename: targetFile.server_filename,
        qualities,
        defaultQuality: qualities.find((q) => q.quality === "720p") || qualities[0]
      };
      return { success: true, data: hlsInfo };
    } catch (e) {
      const err = e;
      return {
        success: false,
        error: {
          code: err.code || ErrorCodes.E_HLS_FAIL,
          message: err.message,
          details: err.details
        }
      };
    }
  }
  /**
   * Parse M3U8 content
   */
  parseM3U8(m3u8Content, baseUrl) {
    return HLSParser.parseM3U8(m3u8Content, baseUrl);
  }
  /**
   * Fetch and parse M3U8 from URL
   */
  async fetchM3U8(m3u8Url) {
    return HLSParser.fetchAndParse(m3u8Url, this.options.headers || {});
  }
  /**
   * Download file via direct link
   */
  async downloadFile(directLink, outputPath, options = {}) {
    return this.fileDownloader.downloadFile(directLink, outputPath, options);
  }
  /**
   * Download HLS stream - MOST ADVANCED FEATURE
   */
  async downloadHLS(m3u8Url, outputPath, options = {}) {
    return this.hlsDownloader.download(m3u8Url, outputPath, {
      concurrency: 5,
      ...options
    });
  }
  /**
   * Download file from share URL directly (auto get info + download first file)
   */
  async downloadFromUrl(shareUrl, outputDir = "./downloads", options = {}) {
    const infoRes = await this.getInfo(shareUrl);
    if (!infoRes.success || !infoRes.data) {
      throw new ValidationError(`Failed to get info: ${infoRes.error?.message}`, infoRes.error);
    }
    const file = infoRes.data.list[0];
    if (!file) throw new ValidationError("No files found in share");
    const outputPath = `${outputDir.replace(/\/$/, "")}/${file.server_filename}`;
    const directLink = file.direct_link || file.dlink;
    return this.downloadFile(directLink, outputPath, options);
  }
  /**
   * Download all files from share (folder)
   */
  async downloadFolder(shareUrl, outputDir = "./downloads", options = {}) {
    const infoRes = await this.getInfo(shareUrl);
    if (!infoRes.success || !infoRes.data) {
      throw new ValidationError(`Failed to get info: ${infoRes.error?.message}`, infoRes.error);
    }
    const filesToDownload = infoRes.data.list.filter((f) => f.isdir === 0);
    const batch = filesToDownload.map((f) => ({
      url: f.direct_link || f.dlink,
      outputPath: `${outputDir.replace(/\/$/, "")}/${f.server_filename}`
    }));
    return this.fileDownloader.downloadBatch(batch, options);
  }
  /**
   * Create HLS read stream (for piping to response, etc)
   */
  createHLSReadStream(m3u8Url, options = {}) {
    return this.hlsDownloader.createReadStream(m3u8Url, options);
  }
  /**
   * Update cookie at runtime
   */
  setCookie(cookie) {
    this.options.cookie = cookie;
    this.api.cookie = cookie;
  }
  /**
   * Get package info - for debugging
   */
  getClientInfo() {
    return {
      version: "1.0.0",
      options: this.options,
      supportedDomains: [
        "terabox.com",
        "1024tera.com",
        "terabox.app",
        "nephobox.com",
        "freeterabox.com",
        "4funbox.com",
        "mirrobox.com",
        "momerybox.com",
        "tibibox.com"
      ],
      features: ["direct_download", "hls_parsing", "hls_download", "folder_download", "batch_download", "m3u8_parser"]
    };
  }
};

// src/index.ts
var index_default = TeraboxXL;
function createClient(options) {
  return new TeraboxXL(options);
}
async function getTeraboxFileInfo(url, options) {
  const client = new TeraboxXL(options);
  return client.getInfo(url);
}
async function getTeraboxDownloadLinks(url, options) {
  const client = new TeraboxXL(options);
  return client.getDownloadLinks(url);
}
async function getTeraboxHLS(url, fsId, options) {
  const client = new TeraboxXL(options);
  return client.getHLSInfo(url, fsId);
}
var VERSION = "1.0.0";
var PACKAGE_NAME = "@xbibzlibrary/terabox-xl";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Errors,
  FileDownloader,
  HLSDownloader,
  HLSParser,
  PACKAGE_NAME,
  TeraboxAPI,
  TeraboxParser,
  TeraboxXL,
  Utils,
  VERSION,
  createClient,
  getTeraboxDownloadLinks,
  getTeraboxFileInfo,
  getTeraboxHLS
});
/**
 * @xbibzlibrary/terabox-xl
 * The ultimate, highly-optimized, and complex Terabox Downloader and Scraper library for Node.js
 * Designed for maximum stability and cross-platform terminal compatibility. Built with modern TypeScript.
 * 
 * @author XbibzOfficial
 * @version 1.0.0
 * @license MIT
 * 
 * Features:
 * - Parse Terabox share links (all domains)
 * - Extract file info with direct CDN links
 * - HLS stream parsing (M3U8_AUTO_360/480/720/1080)
 * - Download HLS stream with concurrency and segment merging
 * - Direct file download with progress
 * - Folder/batch download
 * - Real implementation, no simulation
 * - Production ready, tested, powerful
 */
