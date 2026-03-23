"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compressImageIfNeeded = compressImageIfNeeded;
const sharp_1 = __importDefault(require("sharp"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const MAX_WIDTH = Number(process.env.IMAGE_MAX_WIDTH || 1600);
const JPEG_QUALITY = Number(process.env.IMAGE_JPEG_QUALITY || 80);
const PNG_COMPRESSION_LEVEL = Number(process.env.IMAGE_PNG_COMPRESSION_LEVEL || 9);
const MIN_BYTES = Number(process.env.IMAGE_MIN_COMPRESS_BYTES || 200 * 1024);
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
async function compressImageIfNeeded(filePath, mimeType) {
    try {
        if (!filePath)
            return;
        const ext = path_1.default.extname(filePath).toLowerCase();
        if (!IMAGE_EXTS.has(ext))
            return;
        const stat = await promises_1.default.stat(filePath);
        if (!stat?.size || stat.size < MIN_BYTES)
            return;
        // Keep output format same as input extension.
        const tmpPath = filePath.replace(ext, `-compressed${ext}`);
        await promises_1.default.unlink(tmpPath).catch(() => undefined);
        let img = (0, sharp_1.default)(filePath).rotate().withMetadata();
        img = img.resize({ width: MAX_WIDTH, withoutEnlargement: true });
        if (ext === '.png') {
            await img
                .png({
                compressionLevel: PNG_COMPRESSION_LEVEL,
                adaptiveFiltering: true
            })
                .toFile(tmpPath);
        }
        else if (ext === '.webp') {
            await img.webp({ quality: JPEG_QUALITY }).toFile(tmpPath);
        }
        else {
            // jpg/jpeg
            await img
                .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
                .toFile(tmpPath);
        }
        await promises_1.default.rename(tmpPath, filePath);
    }
    catch (err) {
        // Never fail the request due to compression issues.
        // eslint-disable-next-line no-console
        console.warn('[ImageCompressor] Skipped compression:', err?.message || err);
    }
}
//# sourceMappingURL=imageCompressor.js.map