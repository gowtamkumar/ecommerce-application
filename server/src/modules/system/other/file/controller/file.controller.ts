import { NextFunction, Request, Response } from 'express';

import { ILike } from 'typeorm';
import { getDBConnection } from '@/config/db';
import { CustomRequest } from '@/enums/custom-request-type';
import { asyncHandler } from '@/middlewares/async.middleware';
import { logger } from '@/middlewares/logger';
import { removeFileFromMinio, uploadFileToMinio } from '@/services/minio.service';
import { fileValidationSchema } from '@/validation';
import { FileEntity } from '../model/file.entity';

// @desc Get all Files
// @route GET /api/v1/Files
// @access Public

export const getFiles = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: getFiles ${req.method} ${req.url}`);

  const { search, page, limit } = req.query;

  const connection = await getDBConnection();
  const repository = connection.getRepository(FileEntity);

  const where: any = {};

  if (search) {
    where.originalname = ILike(`%${search}%`);
  }

  // Pagination
  const pageNumber = Math.max(1, parseInt((page || '1') as string, 10)); // ensure >= 1
  const pageSize = Math.max(1, parseInt((limit || '30') as string, 10)); // ensure >= 1
  const skip = (pageNumber - 1) * pageSize;

  const [result, total] = await repository.findAndCount({
    where,
    order: { id: 'DESC' },
    skip,
    take: pageSize,
  });

  const totalPages = Math.ceil(total / pageSize);
  const currentPage = Math.min(pageNumber, totalPages || 1); // ensure currentPage doesn't exceed totalPages

  logger.info(`Fetched ${result.length} files`);

  return res.status(200).json({
    success: true,
    message: 'Get all Files',
    total,
    page: currentPage,
    limit: pageSize,
    totalPages,
    data: result,
  });
});

// @desc Get a single File
// @route GET /api/v1/Files/:id
// @access Public
export const getFile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Service: getFile ${req.method} ${req.url}`);

  const { id } = req.params;
  const connection = await getDBConnection();
  const repository = await connection.getRepository(FileEntity);
  const result = await repository.findOneBy({ id });

  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  return res.status(200).json({
    success: true,
    message: `Get a single File of id ${req.params.id}`,
    data: result,
  });
});

// @desc Create a single File
// @route POST /api/v1/Files
// @access Public
export const createFile = asyncHandler(async (req: CustomRequest, res: Response) => {
  logger.info(`Service: createFile ${req.method} ${req.url}`);

  const connection = await getDBConnection();
  const validation = fileValidationSchema.safeParse(req.body);

  if (!validation.success) {
    const formattedErrors = validation.error.issues.map((issue: any) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));

    return res.status(400).json({
      success: false,
      issues: formattedErrors,
    });
  }

  const repository = connection.getRepository(FileEntity);
  const newFile = repository.create(validation.data);
  const save = await repository.save(newFile);

  return res.status(200).json({
    success: true,
    message: 'File saved successfully',
    data: save,
  });
});

// @desc Create a single File
// @route POST /api/v1/Files
// @access Public
export const fileUpload = asyncHandler(async (req: CustomRequest, res: Response) => {
  logger.info(`Service: fileUpload ${req.method} ${req.url}`);

  const connection = await getDBConnection();
  const repository = connection.getRepository(FileEntity);
  //   const validation = fileValidationSchema.safeParse(req.files);
  // console.log("🚀 ~ req.files:", req.files);

  const newarray: Express.Multer.File[] = [];

  Object.entries(req.files).forEach(([, currfile]) => {
    const newFiles = currfile as Express.Multer.File[];
    newarray.push(...newFiles);
  });

  // Upload every file to MinIO and build the entity records
  const uploaded = await Promise.all(
    newarray.map(async (file: Express.Multer.File) => {
      const meta = await uploadFileToMinio(file);
      return {
        ...meta,
        fieldname: file.fieldname,
        originalname: file.originalname,
        encoding: file.encoding,
        mimetype: file.mimetype,
      };
    }),
  );

  const newFile = repository.create(uploaded);
  const save = await repository.save(newFile);
  return res.status(200).json({
    success: true,
    message: 'Uploaded successfully',
    data: save,
  });
});

// @desc Update a single File
// @route PUT /api/v1/Files/:id
// @access Public
export const updateFile = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: updateFile ${req.method} ${req.url}`);

  const { id } = req.params;
  const connection = await getDBConnection();
  const repository = await connection.getRepository(FileEntity);
  const result = await repository.findOneBy({ id });

  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  const updateData = await repository.merge(result, req.body);
  await repository.save(updateData);

  return res.status(200).json({
    success: true,
    message: 'File details updated successfully',
    data: updateData,
  });
});

// @desc Delete a single File
// @route DELETE /api/v1/Files/:id
// @access Public
export const deleteFile = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: deleteFile ${req.method} ${req.url}`);

  const { id } = req.params;
  const connection = await getDBConnection();
  const repository = await connection.getRepository(FileEntity);

  const result = await repository.findOneBy({ id });
  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  await repository.delete({ id });

  return res.status(200).json({
    success: true,
    message: `Delete a single File of id ${req.params.id}`,
    data: result,
  });
});

// @desc Delete a single File
// @route DELETE /api/v1/files/
// @access Public
export const deleteFileWithPhoto = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: deleteFileWithPhoto ${req.method} ${req.url}`);

  const { filename } = req.body;
  const connection = await getDBConnection();
  const repository = connection.getRepository(FileEntity);

  try {
    // Find the file entity in the database and delete it from MinIO concurrently
    const deleteFile = await repository.findOne({ where: { filename } });

    if (!deleteFile) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
      });
    }

    // Remove the file entity from the database and the object from MinIO
    await Promise.all([repository.remove(deleteFile), removeFileFromMinio(filename)]);

    return res.status(200).json({
      success: true,
      message: `Deleted file with filename: ${filename}`,
      data: deleteFile,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the file',
      error: error.message,
    });
  }
});

// @desc Delete a single File
// @route DELETE /api/v1/files/
// @access Public
export const deleteMultipleFilesWithPhoto = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: deleteMultipleFilesWithPhoto ${req.method} ${req.url}`);

  const { filenames } = req.body; // Expecting: filenames: string[]

  if (!Array.isArray(filenames) || filenames.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Please provide an array of filenames to delete.',
    });
  }

  const connection = await getDBConnection();
  const repository = connection.getRepository(FileEntity);

  try {
    // Find all files in DB that match provided filenames
    const filesToDelete = await repository.find({
      where: filenames.map((filename) => ({ filename })),
    });

    if (filesToDelete.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No matching files found in database.',
      });
    }

    // Prepare MinIO removal promises for existing files
    const removePromises = filesToDelete.map((file: { filename: string }) =>
      removeFileFromMinio(file.filename),
    );

    // Run MinIO removal + DB delete in parallel
    await Promise.all([Promise.all(removePromises), repository.remove(filesToDelete)]);

    return res.status(200).json({
      success: true,
      message: 'Selected files deleted successfully.',
      data: filesToDelete.map((f: { filename: string }) => f.filename),
    });
  } catch (error: any) {
    logger.error(`Error deleting multiple files: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the files.',
      error: error.message,
    });
  }
});
