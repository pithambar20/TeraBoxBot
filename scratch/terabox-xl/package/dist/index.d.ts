/**
 * @xbibzlibrary/terabox-xl - Type Definitions
 * Production-grade, fully typed for maximum DX
 */
interface TeraboxXLOptions {
    /** NDUS cookie from Terabox login, e.g. "ndus=..." - optional but recommended for private files */
    cookie?: string;
    /** Custom User-Agent */
    userAgent?: string;
    /** Request timeout in ms */
    timeout?: number;
    /** Retry attempts */
    retries?: number;
    /** Retry delay base ms */
    retryDelay?: number;
    /** Enable verbose logging */
    verbose?: boolean;
    /** Custom headers */
    headers?: Record<string, string>;
}
interface FileItem {
    fs_id: string | number;
    server_filename: string;
    size: number;
    size_formatted: string;
    isdir: number;
    category?: number;
    dlink: string;
    direct_link?: string;
    path?: string;
    thumbs?: {
        url1?: string;
        url2?: string;
        url3?: string;
        icon?: string;
    };
    md5?: string;
    server_ctime?: number;
    server_mtime?: number;
    local_ctime?: number;
    local_mtime?: number;
}
interface FolderInfo {
    isFolder: boolean;
    totalFiles: number;
    files: FileItem[];
}
interface TeraboxFileInfo extends FileItem, FolderInfo {
    file_name: string;
    file_size: string;
    sizebytes: number;
    thumb?: string;
    link: string;
    direct_link: string;
}
interface TeraboxShareInfo {
    shareid: number;
    uk: number;
    sign: string;
    timestamp: number;
    bdstoken?: string;
    jsToken: string;
    dpLogId: string;
    shorturl: string;
    surl: string;
    isFolder: boolean;
    title?: string;
    list: FileItem[];
    extra?: Record<string, any>;
}
interface ScraperResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: any;
    };
}
interface HLSQuality {
    quality: '360p' | '480p' | '720p' | '1080p' | '4K' | string;
    type: string;
    url: string;
    m3u8Content?: string;
    resolution?: {
        width: number;
        height: number;
    };
    bandwidth?: number;
}
interface HLSInfo {
    shareid: number;
    uk: number;
    fs_id: string | number;
    filename: string;
    qualities: HLSQuality[];
    defaultQuality: HLSQuality;
    rawM3U8?: string;
}
interface M3U8Segment {
    uri: string;
    duration: number;
    title?: string;
    byteRange?: string;
    discontinuity?: boolean;
}
interface M3U8Manifest {
    version?: number;
    targetDuration?: number;
    mediaSequence?: number;
    playlistType?: string;
    segments: M3U8Segment[];
    isVOD: boolean;
    isLive: boolean;
}
interface DownloadProgress {
    downloadedBytes: number;
    totalBytes: number;
    percent: number;
    speed: number;
    eta: number;
    filename: string;
}
type ProgressCallback = (progress: DownloadProgress) => void;
interface DownloadOptions {
    onProgress?: ProgressCallback;
    concurrency?: number;
    chunkSize?: number;
    headers?: Record<string, string>;
    overwrite?: boolean;
    timeout?: number;
    retries?: number;
}
interface TokenData {
    jsToken: string;
    dpLogId: string;
    bdstoken?: string;
    logid?: string;
    shorturl: string;
    defaultThumbnail?: string;
    sekey?: string;
}

declare class TeraboxXL {
    private api;
    private fileDownloader;
    private hlsDownloader;
    private options;
    constructor(options?: TeraboxXLOptions);
    /**
     * Validate URL
     */
    validateUrl(url: string): ScraperResponse<boolean>;
    /**
     * Extract surl
     */
    getSurl(url: string): string;
    /**
     * Get full share info - THE CORE
     */
    getInfo(shareUrl: string): Promise<ScraperResponse<TeraboxShareInfo>>;
    /**
     * Get file list only (simplified)
     */
    getFileList(shareUrl: string): Promise<ScraperResponse<FileItem[]>>;
    /**
     * Get direct download links for all files
     */
    getDownloadLinks(shareUrl: string): Promise<ScraperResponse<Array<{
        filename: string;
        direct_link: string;
        size: number;
        size_formatted: string;
    }>>>;
    /**
     * Get HLS info for video files - POWERFUL FEATURE
     */
    getHLSInfo(shareUrl: string, fsId?: string | number): Promise<ScraperResponse<HLSInfo>>;
    /**
     * Parse M3U8 content
     */
    parseM3U8(m3u8Content: string, baseUrl: string): M3U8Manifest;
    /**
     * Fetch and parse M3U8 from URL
     */
    fetchM3U8(m3u8Url: string): Promise<{
        manifest: M3U8Manifest;
        content: string;
        finalUrl: string;
    }>;
    /**
     * Download file via direct link
     */
    downloadFile(directLink: string, outputPath: string, options?: DownloadOptions): Promise<string>;
    /**
     * Download HLS stream - MOST ADVANCED FEATURE
     */
    downloadHLS(m3u8Url: string, outputPath: string, options?: DownloadOptions): Promise<string>;
    /**
     * Download file from share URL directly (auto get info + download first file)
     */
    downloadFromUrl(shareUrl: string, outputDir?: string, options?: DownloadOptions): Promise<string>;
    /**
     * Download all files from share (folder)
     */
    downloadFolder(shareUrl: string, outputDir?: string, options?: DownloadOptions & {
        concurrency?: number;
    }): Promise<string[]>;
    /**
     * Create HLS read stream (for piping to response, etc)
     */
    createHLSReadStream(m3u8Url: string, options?: DownloadOptions): NodeJS.ReadableStream;
    /**
     * Update cookie at runtime
     */
    setCookie(cookie: string): void;
    /**
     * Get package info - for debugging
     */
    getClientInfo(): {
        version: string;
        options: TeraboxXLOptions;
        supportedDomains: string[];
        features: string[];
    };
}

/**
 * Downloader - Real file download with progress, resume, HLS
 */

declare class FileDownloader {
    private defaultTimeout;
    private defaultHeaders;
    constructor(options?: {
        timeout?: number;
        headers?: Record<string, string>;
    });
    /**
     * Download direct file with progress - REAL implementation
     */
    downloadFile(url: string, outputPath: string, options?: DownloadOptions): Promise<string>;
    /**
     * Get file size via HEAD
     */
    getFileSize(url: string, headers?: Record<string, string>): Promise<number>;
    /**
     * Batch download multiple files
     */
    downloadBatch(files: Array<{
        url: string;
        outputPath: string;
    }>, options?: DownloadOptions & {
        concurrency?: number;
    }): Promise<string[]>;
}

/**
 * HLS Downloader - Real implementation, not simulation
 * Supports parsing m3u8, downloading segments with concurrency, merging
 */

declare class HLSParser {
    static parseM3U8(content: string, baseUrl: string): M3U8Manifest;
    static fetchAndParse(url: string, headers?: Record<string, string>): Promise<{
        manifest: M3U8Manifest;
        content: string;
        finalUrl: string;
    }>;
}
declare class HLSDownloader {
    private concurrency;
    private timeout;
    private headers;
    constructor(options?: {
        concurrency?: number;
        timeout?: number;
        headers?: Record<string, string>;
    });
    /**
     * Download HLS stream to file - REAL implementation
     */
    download(m3u8Url: string, outputPath: string, options?: DownloadOptions): Promise<string>;
    /**
     * Create a readable stream for HLS (for piping)
     * Simplified version - downloads and pipes
     */
    createReadStream(m3u8Url: string, options?: DownloadOptions): NodeJS.ReadableStream;
}

/**
 * API Client - Real Terabox API implementation
 * No simulation, uses actual endpoints
 */

declare class TeraboxAPI {
    private cookie?;
    private userAgent;
    private timeout;
    private retries;
    private retryDelay;
    private verbose;
    private extraHeaders;
    constructor(options?: {
        cookie?: string;
        userAgent?: string;
        timeout?: number;
        retries?: number;
        retryDelay?: number;
        verbose?: boolean;
        headers?: Record<string, string>;
    });
    private log;
    /**
     * Fetch with timeout and retry - REAL network call
     */
    private fetchWithRetry;
    /**
     * Get share page HTML and extract tokens
     */
    getTokensFromSharePage(shareUrl: string): Promise<{
        html: string;
        tokens: TokenData;
        finalUrl: string;
        cookies: Record<string, string>;
    }>;
    /**
     * Get file list from share/list API
     */
    getFileList(surl: string, tokens: TokenData, dir?: string): Promise<{
        list: any[];
        shareInfo: any;
    }>;
    /**
     * Resolve dlink to real direct CDN link via HEAD
     */
    resolveDirectLink(dlink: string): Promise<string>;
    /**
     * Get file info complete flow
     */
    getShareInfo(shareUrl: string): Promise<TeraboxShareInfo>;
    private formatSize;
    /**
     * Try to get HLS streaming URL for a file
     * Uses multiple endpoints fallback
     */
    getHLSStreamUrl(shareInfo: TeraboxShareInfo, fsId: string | number, qualityType?: string): Promise<string>;
    /**
     * Get all HLS qualities for a file
     */
    getAllHLSQualities(shareInfo: TeraboxShareInfo, fsId: string | number, filename: string): Promise<Array<{
        quality: string;
        type: string;
        url: string;
    }>>;
}

/**
 * Parser - Extract tokens from Terabox HTML
 * Real implementation, not simulation
 */

declare class TeraboxParser {
    /**
     * Extract all required tokens from share page HTML
     * This is the core of Terabox scraping - real parsing
     */
    static extractTokens(html: string, finalUrl: string): TokenData;
    /**
     * Parse file list from API JSON
     */
    static parseFileList(apiJson: any): {
        list: any[];
        extra: any;
    };
    /**
     * Extract HLS qualities from streaming API or page
     */
    static extractHLSQualities(m3u8MasterContent: string, baseUrl: string): Array<{
        quality: string;
        type: string;
        url: string;
        bandwidth?: number;
        resolution?: any;
    }>;
}

/**
 * @xbibzlibrary/terabox-xl
 * Advanced Error Handling - Mirip dengan paket teraboxscraper sebelumnya
 * Setiap error memiliki code eksplisit untuk debugging maksimal
 */
declare const ErrorCodes: {
    readonly E_INVALID_URL: "E_INVALID_URL";
    readonly E_NETWORK_FAIL: "E_NETWORK_FAIL";
    readonly E_PARSING_FAIL: "E_PARSING_FAIL";
    readonly E_API_FAIL: "E_API_FAIL";
    readonly E_TOKEN_MISSING: "E_TOKEN_MISSING";
    readonly E_FILE_NOT_FOUND: "E_FILE_NOT_FOUND";
    readonly E_EXPIRED_LINK: "E_EXPIRED_LINK";
    readonly E_RATE_LIMIT: "E_RATE_LIMIT";
    readonly E_HLS_FAIL: "E_HLS_FAIL";
    readonly E_DOWNLOAD_FAIL: "E_DOWNLOAD_FAIL";
    readonly E_VALIDATION_FAIL: "E_VALIDATION_FAIL";
    readonly E_COOKIE_INVALID: "E_COOKIE_INVALID";
    readonly E_UNSUPPORTED: "E_UNSUPPORTED";
};
type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];
declare class TeraboxXLError extends Error {
    code: ErrorCode;
    statusCode?: number;
    details?: any;
    timestamp: string;
    constructor(message: string, code: ErrorCode, statusCode?: number, details?: any);
    toJSON(): {
        name: string;
        message: string;
        code: ErrorCode;
        statusCode: number | undefined;
        details: any;
        timestamp: string;
    };
}
declare class NetworkError extends TeraboxXLError {
    constructor(message: string, details?: any);
}
declare class ParsingError extends TeraboxXLError {
    constructor(message: string, details?: any);
}
declare class APIError extends TeraboxXLError {
    constructor(message: string, statusCode?: number, details?: any);
}
declare class ValidationError extends TeraboxXLError {
    constructor(message: string, details?: any);
}
declare class HLSError extends TeraboxXLError {
    constructor(message: string, details?: any);
}

type errors_APIError = APIError;
declare const errors_APIError: typeof APIError;
type errors_ErrorCode = ErrorCode;
declare const errors_ErrorCodes: typeof ErrorCodes;
type errors_HLSError = HLSError;
declare const errors_HLSError: typeof HLSError;
type errors_NetworkError = NetworkError;
declare const errors_NetworkError: typeof NetworkError;
type errors_ParsingError = ParsingError;
declare const errors_ParsingError: typeof ParsingError;
type errors_TeraboxXLError = TeraboxXLError;
declare const errors_TeraboxXLError: typeof TeraboxXLError;
type errors_ValidationError = ValidationError;
declare const errors_ValidationError: typeof ValidationError;
declare namespace errors {
  export { errors_APIError as APIError, type errors_ErrorCode as ErrorCode, errors_ErrorCodes as ErrorCodes, errors_HLSError as HLSError, errors_NetworkError as NetworkError, errors_ParsingError as ParsingError, errors_TeraboxXLError as TeraboxXLError, errors_ValidationError as ValidationError };
}

/**
 * Utils - Production helpers
 */
declare const TERABOX_DOMAINS: string[];
declare const DEFAULT_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";
declare function formatBytes(bytes: number): string;
declare function extractSurlFromUrl(inputUrl: string): string;
declare function validateTeraboxUrl(url: string): boolean;
declare function findBetween(data: string, first: string, last: string): string | null;
declare function extractWithRegex(text: string, patterns: RegExp[]): string | null;
declare function sleep(ms: number): Promise<void>;
declare function retry<T>(fn: () => Promise<T>, attempts?: number, delay?: number, backoff?: number): Promise<T>;
declare function buildHeaders(cookie?: string, userAgent?: string, extra?: Record<string, string>): Record<string, string>;
declare function parseCookieString(cookieStr: string): Record<string, string>;
declare function isVideoFile(filename: string): boolean;
declare function isAudioFile(filename: string): boolean;

declare const utils_DEFAULT_USER_AGENT: typeof DEFAULT_USER_AGENT;
declare const utils_TERABOX_DOMAINS: typeof TERABOX_DOMAINS;
declare const utils_buildHeaders: typeof buildHeaders;
declare const utils_extractSurlFromUrl: typeof extractSurlFromUrl;
declare const utils_extractWithRegex: typeof extractWithRegex;
declare const utils_findBetween: typeof findBetween;
declare const utils_formatBytes: typeof formatBytes;
declare const utils_isAudioFile: typeof isAudioFile;
declare const utils_isVideoFile: typeof isVideoFile;
declare const utils_parseCookieString: typeof parseCookieString;
declare const utils_retry: typeof retry;
declare const utils_sleep: typeof sleep;
declare const utils_validateTeraboxUrl: typeof validateTeraboxUrl;
declare namespace utils {
  export { utils_DEFAULT_USER_AGENT as DEFAULT_USER_AGENT, utils_TERABOX_DOMAINS as TERABOX_DOMAINS, utils_buildHeaders as buildHeaders, utils_extractSurlFromUrl as extractSurlFromUrl, utils_extractWithRegex as extractWithRegex, utils_findBetween as findBetween, utils_formatBytes as formatBytes, utils_isAudioFile as isAudioFile, utils_isVideoFile as isVideoFile, utils_parseCookieString as parseCookieString, utils_retry as retry, utils_sleep as sleep, utils_validateTeraboxUrl as validateTeraboxUrl };
}

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

declare function createClient(options?: TeraboxXLOptions): TeraboxXL;
declare function getTeraboxFileInfo(url: string, options?: TeraboxXLOptions): Promise<ScraperResponse<TeraboxShareInfo>>;
declare function getTeraboxDownloadLinks(url: string, options?: TeraboxXLOptions): Promise<ScraperResponse<Array<{
    filename: string;
    direct_link: string;
    size: number;
    size_formatted: string;
}>>>;
declare function getTeraboxHLS(url: string, fsId?: string | number, options?: TeraboxXLOptions): Promise<ScraperResponse<HLSInfo>>;
declare const VERSION = "1.0.0";
declare const PACKAGE_NAME = "@xbibzlibrary/terabox-xl";

export { type DownloadOptions, type DownloadProgress, errors as Errors, FileDownloader, type FileItem, HLSDownloader, type HLSInfo, HLSParser, type HLSQuality, type M3U8Manifest, type M3U8Segment, PACKAGE_NAME, type ScraperResponse, TeraboxAPI, type TeraboxFileInfo, TeraboxParser, type TeraboxShareInfo, TeraboxXL, type TeraboxXLOptions, type TokenData, utils as Utils, VERSION, createClient, TeraboxXL as default, getTeraboxDownloadLinks, getTeraboxFileInfo, getTeraboxHLS };
