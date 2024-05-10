import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { fileValidationSchema } from "../../../validation";
import { FileEntity } from "../model/file.entity";

// @desc Get all Files
// @route GET /api/v1/Files
// @access Public
export const getFiles = asyncHandler(async (req: Request, res: Response) => {
  const connection = await getDBConnection();
  const repository = connection.getRepository(FileEntity);

  const result = await repository.find();

  return res.status(200).json({
    success: true,
    msg: "Get all Files",
    data: result,
  });
});

// @desc Get a single File
// @route GET /api/v1/Files/:id
// @access Public
export const getFile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(FileEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      msg: `Get a single File of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Create a single File
// @route POST /api/v1/Files
// @access Public
export const createFile = asyncHandler(async (req: any, res: Response) => {
  const connection = await getDBConnection();
  const validation = fileValidationSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(401).json({
      message: validation.error.formErrors,
    });
  }

  const repository = connection.getRepository(FileEntity);

  const newFile = repository.create(validation.data);

  const save = await repository.save(newFile);

  return res.status(200).json({
    success: true,
    msg: "Create a new File",
    data: save,
  });
});

// @desc Create a single File
// @route POST /api/v1/Files
// @access Public
export const fileUpload = asyncHandler(async (req: any, res: Response) => {
  const connection = await getDBConnection();
  //   const validation = fileValidationSchema.safeParse(req.files);
  // console.log( validation.error);
  // console.log(req.files);
  const newarray: any = [];
  Object.entries(req.files).forEach(([item, currfile]) => {
    const newFiles: any = currfile;
    newarray.push(...newFiles);
  });

  //   if (!validation.success) {
  //     return res.status(401).json({
  //       message: validation.error.formErrors,
  //     });
  //   }

  const repository = connection.getRepository(FileEntity);

  const newFile = repository.create(newarray);

  const save = await repository.save(newFile);

  return res.status(200).json({
    success: true,
    msg: "Create a new File",
    data: save,
  });
});

// @desc Update a single File
// @route PUT /api/v1/Files/:id
// @access Public
export const updateFile = asyncHandler(async (req: Request, res: Response) => {
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
    msg: `Update a single File of id ${req.params.id}`,
    data: updateData,
  });
});

// @desc Delete a single File
// @route DELETE /api/v1/Files/:id
// @access Public
export const deleteFile = asyncHandler(async (req: Request, res: Response) => {
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
    msg: `Delete a single File of id ${req.params.id}`,
    data: result,
  });
});
