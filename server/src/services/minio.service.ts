import crypto from 'crypto';
import path from 'path';
import { Client } from 'minio';
import { Repository } from 'typeorm';
import { logger } from '@/middlewares/logger';
import { FileEntity } from '@/modules/system/other/file/model/file.entity';

const bucketName = process.env.MINIO_BUCKET || 'ecommerce';

const getMinioClient = (): Client => {
  const endPoint = process.env.MINIO_ENDPOINT || 'minio';
  const port = parseInt(process.env.MINIO_PORT || '9000', 10);
  const useSSL = (process.env.MINIO_USE_SSL || 'false').toLowerCase() === 'true';

  return new Client({
    endPoint,
    port,
    useSSL,
    accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
  });
};

let client: Client | undefined;

const minioClient = (): Client => {
  if (!client) {
    client = getMinioClient();
  }
  return client;
};

// Make sure the bucket exists (the compose `minio-init` job normally does this)
export const ensureBucket = async (): Promise<void> => {
  const exists = await minioClient().bucketExists(bucketName);
  if (!exists) {
    await minioClient().makeBucket(bucketName);
  }
};

// Public URL for an object inside the (public) bucket
export const getPublicFileUrl = (filename: string): string => {
  const base = (
    process.env.MINIO_PUBLIC_URL || `http://localhost:${process.env.MINIO_PORT || '9000'}`
  ).replace(/\/$/, '');
  return `${base}/${bucketName}/${filename}`;
};

// Extract the object key from a full MinIO/public URL, or return the value as-is
export const getObjectKey = (value: string): string => {
  if (!value || typeof value !== 'string') return value;
  if (/^https?:\/\//i.test(value)) {
    try {
      return decodeURIComponent(value.split('/').pop() || value);
    } catch {
      return value;
    }
  }
  return value;
};

// Find a FileEntity by its object key OR its stored public URL
export const findFileEntity = async (
  repository: Repository<FileEntity>,
  value: string,
): Promise<FileEntity | null> => {
  return repository.findOne({
    where: [{ filename: getObjectKey(value) }, { path: value }],
  });
};

// Upload a multer file (buffer) to MinIO and return metadata for the files table
export const uploadFileToMinio = async (file: {
  fieldname: string;
  originalname: string;
  mimetype: string;
  buffer: Buffer;
}): Promise<{ filename: string; path: string; size: number; destination: string }> => {
  const extension =
    path.extname(file.originalname).toLowerCase() || `.${file.mimetype.split('/')[1] || 'bin'}`;
  const objectName = `${file.fieldname}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}${extension}`;

  await minioClient().putObject(bucketName, objectName, file.buffer, file.buffer.length, {
    'Content-Type': file.mimetype,
  });

  logger.info(`Uploaded file to MinIO: ${bucketName}/${objectName}`);

  return {
    filename: objectName,
    path: getPublicFileUrl(objectName),
    size: file.buffer.length,
    destination: `minio:${bucketName}`,
  };
};

// Delete an object from MinIO (accepts an object key or a full public URL; missing objects are not an error)
export const removeFileFromMinio = async (filename: string): Promise<void> => {
  if (!filename) return;
  const objectKey = getObjectKey(filename);
  try {
    await minioClient().removeObject(bucketName, objectKey);
    logger.info(`Removed file from MinIO: ${bucketName}/${objectKey}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.warn(`MinIO remove failed for ${objectKey}: ${message}`);
  }
};

export { minioClient, bucketName };
