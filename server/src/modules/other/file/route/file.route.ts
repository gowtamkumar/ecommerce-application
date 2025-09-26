/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import { AuthGuard } from '../../../../middlewares/auth.middleware';
import { upload } from '../../../../middlewares/fileUpload';
import {
  createFile,
  deleteFile,
  deleteFileWithPhoto,
  fileUpload,
  getFile,
  getFiles,
  updateFile,
} from '../controller/file.controller';

const router = express.Router();

router.route('/').get(getFiles).post(createFile);
router.route('/delete-file-with-photo').post(deleteFileWithPhoto);
router.route('/uploads').post(
  upload.fields([
    {
      name: 'thumbnailImage',
      maxCount: 1,
    },
    {
      name: 'hoverImage',
      maxCount: 1,
    },
    {
      name: 'metaImage',
      maxCount: 1,
    },
    {
      name: 'image',
      maxCount: 1,
    },
    {
      name: 'favicon',
      maxCount: 1,
    },
    {
      name: 'images',
      maxCount: 5,
    },
  ]) as any,
  AuthGuard,
  fileUpload,
);

router.route('/:id').get(getFile).put(updateFile).delete(deleteFile);

export default router;
