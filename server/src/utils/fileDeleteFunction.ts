import { getDBConnection } from '@/config/db';
import { logger } from '@/middlewares/logger';
import { FileEntity } from '@/modules/system/other/file/model/file.entity';
import { findFileEntity, removeFileFromMinio } from '@/services/minio.service';

export const fileDeleteFunction = async (images: any) => {
  const connection = await getDBConnection();
  const repository = connection.getRepository(FileEntity);

  // Use Promise.all to handle multiple file deletions in parallel
  const fileDeletions = images.map(async (item: any) => {
    try {
      // Find and remove file record from the database (by object key or public URL)
      const fileRecord = await findFileEntity(repository, item);
      if (fileRecord) {
        await repository.remove(fileRecord); // Remove from DB
      }

      // Delete the object from MinIO
      await removeFileFromMinio(item);
    } catch (error: any) {
      logger.error(`Failed to delete file ${item}: ${error.message}`);
    }
  });

  // Wait for all file deletions to complete
  await Promise.all(fileDeletions);
};
