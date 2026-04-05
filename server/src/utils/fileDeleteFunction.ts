import fs from 'fs';
import { join } from 'path';
import { getDBConnection } from '@/config/db';
import { logger } from '@/middlewares/logger';
import { FileEntity } from '@/modules/system/other/file/model/file.entity';

export const fileDeleteFunction = async (images: any) => {
  const connection = await getDBConnection();
  const repository = connection.getRepository(FileEntity);
  const directory = join(process.cwd(), '/public/uploads');

  // Use Promise.all to handle multiple file deletions in parallel
  const fileDeletions = images.map(async (item: any) => {
    const filePath = `${directory}/${item}`;
    try {
      // Find and remove file record from the database
      const fileRecord = await repository.findOne({
        where: { filename: item },
      });
      if (fileRecord) {
        await repository.remove(fileRecord); // Remove from DB
      }

      // Delete the file from the filesystem
      await fs.promises.unlink(filePath); // Delete file
    } catch (error: any) {
      logger.error(`Failed to delete file ${filePath}: ${error.message}`);
    }
  });

  // Wait for all file deletions to complete
  await Promise.all(fileDeletions);
};
