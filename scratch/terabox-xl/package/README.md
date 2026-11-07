# @xbibzlibrary/terabox-xl

**The Ultimate, Highly-Optimized, and Complex Terabox Downloader and Scraper Library for Node.js, designed for maximum stability and cross-platform terminal compatibility. Built with modern TypeScript.**

[![NPM Version](https://img.shields.io/npm/v/@xbibzlibrary/terabox-xl)](https://www.npmjs.com/package/@xbibzlibrary/terabox-xl)
[![License](https://img.shields.io/npm/l/@xbibzlibrary/terabox-xl)](https://github.com/XbibzOfficial/terabox-xl)
[![Node](https://img.shields.io/node/v/@xbibzlibrary/terabox-xl)](https://nodejs.org)

NO SIMULATION - REAL IMPLEMENTATION. Production-ready, clinically tested, powerful.

## 🚀 Fitur Utama (Bukan Fitur Sederhana!)

1. **Parsing Mendalam & Powerfull**: Extract `surl`, `jsToken`, `dp-logid`, `bdstoken`, `sekey` langsung dari HTML share page via regex multi-pattern dengan fallback agresif. Support 14+ domain Terabox: `terabox.com`, `1024tera.com`, `terabox.app`, `nephobox.com`, `freeterabox.com`, `4funbox.com`, `mirrobox.com`, `momerybox.com`, `tibibox.com`.

2. **Direct Download Link Resolver**: Ambil `dlink` dari API `share/list?app_id=250528` lalu resolve via HEAD request untuk dapat CDN direct link permanen.

3. **HLS Stream Support Canggih**:
   - Endpoint: `/share/streaming?shareid=&uk=&sign=&timestamp=&fs_id=&type=M3U8_AUTO_xxx`
   - Support kualitas: `M3U8_AUTO_360`, `480`, `720`, `1080`, `1440`
   - Parse master M3U8 -> pilih best quality
   - Download HLS dengan concurrency (default 5), segment merging, progress tracking
   - Create readable stream untuk piping ke HTTP response / player

4. **Folder & Batch Download**: Recursive folder handling, batch download dengan concurrency control.

5. **Error Handling Maksimal**: Setiap fungsi dalam `ScraperResponse` dengan code eksplisit: `E_INVALID_URL`, `E_NETWORK_FAIL`, `E_PARSING_FAIL`, `E_API_FAIL`, `E_HLS_FAIL`, `E_DOWNLOAD_FAIL`, dll.

6. **Dibangun dengan TypeScript**: Full type safety, ESM + CJS dual build, declaration maps.

## 🛠️ Instalasi

```bash
npm install @xbibzlibrary/terabox-xl
# atau
yarn add @xbibzlibrary/terabox-xl
# atau
pnpm add @xbibzlibrary/terabox-xl
```

Node.js v18+ required (native fetch).

## ⚡ Quick Start

```typescript
import { TeraboxXL } from '@xbibzlibrary/terabox-xl';

const tb = new TeraboxXL({
  cookie: 'ndus=YOUR_NDUS_COOKIE', // optional but recommended
  timeout: 15000,
  retries: 3,
  verbose: false
});

// 1. Get file info
const info = await tb.getInfo('https://terabox.com/s/1AbCdEfGhIjKlMnOpQrStUv');
if (info.success) {
  console.log('Files:', info.data.list);
  console.log('ShareID:', info.data.shareid);
}

// 2. Get direct download links
const links = await tb.getDownloadLinks('https://terabox.com/s/1AbCdEfGx...');
console.log(links.data);
// [{ filename: 'video.mp4', direct_link: 'https://d-jp01...', size: 123456, size_formatted: '117 MB' }]

// 3. Download file with progress
await tb.downloadFile(links.data[0].direct_link, './video.mp4', {
  onProgress: (p) => console.log(`${p.percent.toFixed(2)}% - ${p.speed/1024} KB/s`)
});

// 4. Get HLS info (for video files)
const hlsInfo = await tb.getHLSInfo('https://terabox.com/s/1AbCdEfGx...');
if (hlsInfo.success) {
  console.log('Qualities:', hlsInfo.data.qualities);
  // [{ quality: '720p', type: 'M3U8_AUTO_720', url: 'https://...' }, ...]
}

// 5. Download HLS stream (real HLS parser + segment merger)
await tb.downloadHLS(hlsInfo.data.defaultQuality.url, './video_hls.mp4', {
  concurrency: 5,
  onProgress: (p) => console.log(`HLS ${p.percent.toFixed(1)}%`)
});

// 6. Create HLS read stream (for video player)
const stream = tb.createHLSReadStream(hlsInfo.data.qualities[0].url);
// stream.pipe(res) // for Express
```

## 🔧 Advanced Usage

### Cookie NDUS (Untuk file private / premium)

Login ke terabox.com > F12 > Application > Cookies > Copy `ndus` value.

```typescript
const tb = new TeraboxXL({
  cookie: 'ndus=Y4k3I0NreXU4SXJ...', // atau 'ndus=...; lang=en; ...'
});
```

Tanpa cookie, link publik tetap bisa (limit).

### Parse M3U8 Manual

```typescript
import { HLSParser } from '@xbibzlibrary/terabox-xl';

const { manifest, content } = await HLSParser.fetchAndParse('https://.../playlist.m3u8');
console.log(manifest.segments.length, manifest.isVOD);
```

### Folder Download

```typescript
await tb.downloadFolder('https://terabox.com/s/1FolderLink', './my_folder', {
  concurrency: 3,
  onProgress: (p) => console.log(p.filename, p.percent)
});
```

### Custom Headers / Proxy

```typescript
const tb = new TeraboxXL({
  headers: {
    'X-Forwarded-For': '1.2.3.4'
  }
});
```

## 📦 API Reference

### `new TeraboxXL(options)`

- `cookie?: string` - NDUS cookie
- `userAgent?: string` - custom UA
- `timeout?: number` - ms, default 15000
- `retries?: number` - default 3
- `retryDelay?: number` - base ms
- `verbose?: boolean`
- `headers?: Record<string,string>`

### Methods

- `getInfo(url): Promise<ScraperResponse<TeraboxShareInfo>>` - core, get shareid, uk, sign, file list
- `getFileList(url): Promise<ScraperResponse<FileItem[]>>`
- `getDownloadLinks(url): Promise<ScraperResponse<...>>`
- `getHLSInfo(url, fsId?): Promise<ScraperResponse<HLSInfo>>` - get all qualities
- `downloadFile(directLink, outputPath, options): Promise<string>`
- `downloadHLS(m3u8Url, outputPath, options): Promise<string>` - real HLS downloader
- `downloadFromUrl(shareUrl, outputDir, options): Promise<string>` - one-liner
- `downloadFolder(shareUrl, outputDir, options): Promise<string[]>`
- `createHLSReadStream(m3u8Url, options): ReadableStream`
- `parseM3U8(content, baseUrl): M3U8Manifest`
- `fetchM3U8(url): Promise<{manifest, content, finalUrl}>`
- `validateUrl(url): ScraperResponse<boolean>`
- `getSurl(url): string`

### Error Codes

- `E_INVALID_URL`
- `E_NETWORK_FAIL`
- `E_PARSING_FAIL`
- `E_API_FAIL`
- `E_TOKEN_MISSING`
- `E_FILE_NOT_FOUND`
- `E_EXPIRED_LINK`
- `E_HLS_FAIL`
- `E_DOWNLOAD_FAIL`
- etc

Semua error dalam format:
```typescript
{
  success: false,
  error: {
    code: 'E_...',
    message: '...',
    details: {...}
  }
}
```

## 🧪 Testing - Real, Not Simulation

```bash
npm run build
node examples/basic.js
node examples/hls.js
node examples/download.js
```

Tested dengan:
- Single file link
- Folder link (multi files)
- Video file HLS 360p/720p/1080p
- Expired link handling
- Invalid URL handling
- Cookie vs no-cookie

## 📁 Examples

Lihat folder `examples/`:

- `basic.js` - get info
- `hls.js` - HLS parsing & download
- `download.js` - direct download with progress

## 🏗️ Architecture (Mendalam)

```
URL Input -> validateTeraboxUrl -> extractSurl -> getTokensFromSharePage
  -> fetch HTML from 4 candidate domains
  -> TeraboxParser.extractTokens (jsToken, dp-logid, bdstoken via multi-regex + aggressive fallback)
  -> getFileList via /share/list?app_id=250528&jsToken=&dp-logid=&shorturl=
  -> resolveDirectLink via HEAD Location
  -> return TeraboxShareInfo

HLS:
  getShareInfo -> getAllHLSQualities -> for each type M3U8_AUTO_*
    -> /share/streaming?shareid=&uk=&sign=&timestamp=&fs_id=&type=&sekey=&dp-logid=
    -> get m3u8 URL/content
  -> HLSParser.parseM3U8 (EXT-X-STREAM-INF, EXTINF, BYTERANGE)
  -> HLSDownloader.download (concurrency pool, segment fetch, merge via fs)

Download:
  FileDownloader.downloadFile (fetch with stream reader, progress callback, speed/eta calculation)
```

## 📄 License

MIT - XbibzOfficial

## ⚠️ Disclaimer

This library is for educational purposes. Use responsibly and respect Terabox ToS. Only download files you have permission to access.

## 🔗 Links

- NPM: https://www.npmjs.com/package/@xbibzlibrary/terabox-xl
- GitHub: https://github.com/XbibzOfficial/terabox-xl
- Old version: @xbibzlibrary/teraboxscraper

---

**Production ready, teruji klinis, powerfull, canggih, mendalam, nyata!**
