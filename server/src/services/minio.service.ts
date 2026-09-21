import crypto from 'crypto';
import path from 'path';
import { Client } from 'minio';
import { logger } from '@/middlewares/logger';

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

// Delete an object from MinIO (missing objects are not an error)
export const removeFileFromMinio = async (filename: string): Promise<void> => {
  if (!filename) return;
  try {
    await minioClient().removeObject(bucketName, filename);
    logger.info(`Removed file from MinIO: ${bucketName}/${filename}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.warn(`MinIO remove failed for ${filename}: ${message}`);
  }
};

export { minioClient, bucketName };
