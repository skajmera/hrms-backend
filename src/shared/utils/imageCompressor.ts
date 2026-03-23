import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const MAX_WIDTH = Number(process.env.IMAGE_MAX_WIDTH || 1600);
const JPEG_QUALITY = Number(process.env.IMAGE_JPEG_QUALITY || 80);
const PNG_COMPRESSION_LEVEL = Number(process.env.IMAGE_PNG_COMPRESSION_LEVEL || 9);
const MIN_BYTES = Number(process.env.IMAGE_MIN_COMPRESS_BYTES || 200 * 1024);

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

export async function compressImageIfNeeded(
  filePath: string,
  mimeType?: string
): Promise<void> {
  try {
    if (!filePath) return;
    const ext = path.extname(filePath).toLowerCase();
    if (!IMAGE_EXTS.has(ext)) return;

    const stat = await fs.stat(filePath);
    if (!stat?.size || stat.size < MIN_BYTES) return;

    // Keep output format same as input extension.
    const tmpPath = filePath.replace(ext, `-compressed${ext}`);
    await fs.unlink(tmpPath).catch(() => undefined);

    let img = sharp(filePath).rotate().withMetadata();
    img = img.resize({ width: MAX_WIDTH, withoutEnlargement: true });

    if (ext === '.png') {
      await img
        .png({
          compressionLevel: PNG_COMPRESSION_LEVEL,
          adaptiveFiltering: true
        })
        .toFile(tmpPath);
    } else if (ext === '.webp') {
      await img.webp({ quality: JPEG_QUALITY }).toFile(tmpPath);
    } else {
      // jpg/jpeg
      await img
        .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
        .toFile(tmpPath);
    }

    await fs.rename(tmpPath, filePath);
  } catch (err) {
    // Never fail the request due to compression issues.
    // eslint-disable-next-line no-console
    console.warn('[ImageCompressor] Skipped compression:', (err as any)?.message || err);
  }
}

