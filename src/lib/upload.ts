import { NextRequest } from 'next/server';
import sharp from 'sharp';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { FILE_UPLOAD } from './constants';

export interface UploadedFile {
  filename: string;
  originalName: string;
  size: number;
  mimetype: string;
  path: string;
  url: string;
}

// Dosya yükleme için izin verilen MIME tipleri
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

// Dosya boyutu kontrolü
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Güvenli dosya adı oluşturma
export function generateSafeFilename(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const extension = path.extname(originalName).toLowerCase();
  const baseName = path.basename(originalName, extension)
    .replace(/[^a-zA-Z0-9]/g, '-')
    .substring(0, 20);
  
  return `${timestamp}-${random}-${baseName}${extension}`;
}

// Upload klasörünü oluşturma
export async function ensureUploadDir(uploadPath: string): Promise<void> {
  if (!existsSync(uploadPath)) {
    await mkdir(uploadPath, { recursive: true });
  }
}

// Görsel optimizasyonu
export async function optimizeImage(
  buffer: Buffer,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp';
  } = {}
): Promise<Buffer> {
  const {
    width = 800,
    height = 600,
    quality = 80,
    format = 'webp',
  } = options;

  return sharp(buffer)
    .resize(width, height, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .toFormat(format, { quality })
    .toBuffer();
}

// Thumbnail oluşturma
export async function createThumbnail(
  buffer: Buffer,
  size: number = 200
): Promise<Buffer> {
  return sharp(buffer)
    .resize(size, size, {
      fit: 'cover',
      position: 'center',
    })
    .toFormat('webp', { quality: 70 })
    .toBuffer();
}

// FormData'dan dosyaları çıkarma
export async function extractFilesFromFormData(
  request: NextRequest
): Promise<File[]> {
  try {
    const formData = await request.formData();
    const files: File[] = [];

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        files.push(value);
      }
    }

    return files;
  } catch (error) {
    console.error('FormData parse hatası:', error);
    return [];
  }
}

// Dosya validasyonu
export function validateFile(file: File): { valid: boolean; error?: string } {
  // MIME type kontrolü
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Desteklenmeyen dosya tipi: ${file.type}. İzin verilen tipler: ${ALLOWED_MIME_TYPES.join(', ')}`,
    };
  }

  // Dosya boyutu kontrolü
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Dosya boyutu çok büyük: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maksimum: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
  }

  return { valid: true };
}

// Tek dosya yükleme
export async function uploadSingleFile(
  file: File,
  uploadDir: string = 'products'
): Promise<UploadedFile> {
  // Dosya validasyonu
  const validation = validateFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Upload klasörü
  const uploadPath = path.join(process.cwd(), 'public', 'uploads', uploadDir);
  await ensureUploadDir(uploadPath);

  // Dosya adı oluştur
  const filename = generateSafeFilename(file.name);
  const filePath = path.join(uploadPath, filename);

  // Dosyayı buffer'a çevir
  const buffer = Buffer.from(await file.arrayBuffer());

  // Görsel optimizasyonu
  const optimizedBuffer = await optimizeImage(buffer);

  // Dosyayı kaydet
  await writeFile(filePath, optimizedBuffer);

  // Thumbnail oluştur
  const thumbnailBuffer = await createThumbnail(buffer);
  const thumbnailFilename = `thumb_${filename}`;
  const thumbnailPath = path.join(uploadPath, thumbnailFilename);
  await writeFile(thumbnailPath, thumbnailBuffer);

  return {
    filename,
    originalName: file.name,
    size: optimizedBuffer.length,
    mimetype: file.type,
    path: filePath,
    url: `/uploads/${uploadDir}/${filename}`,
  };
}

// Çoklu dosya yükleme
export async function uploadMultipleFiles(
  files: File[],
  uploadDir: string = 'products'
): Promise<UploadedFile[]> {
  const uploadPromises = files.map(file => uploadSingleFile(file, uploadDir));
  return Promise.all(uploadPromises);
}

// Dosya silme
export async function deleteFile(filePath: string): Promise<void> {
  try {
    const fs = require('fs').promises;
    await fs.unlink(filePath);
    
    // Thumbnail'i de sil
    const dir = path.dirname(filePath);
    const filename = path.basename(filePath);
    const thumbnailPath = path.join(dir, `thumb_${filename}`);
    
    try {
      await fs.unlink(thumbnailPath);
    } catch (error) {
      // Thumbnail yoksa hata verme
    }
  } catch (error) {
    console.error('Dosya silme hatası:', error);
  }
}