import express from 'express';
import { AuthGuard } from '@/middlewares/auth.middleware';
import { upload } from '@/middlewares/fileUpload';
import {
  createFile,
  deleteFile,
  deleteFileWithPhoto,
  deleteMultipleFilesWithPhoto,
  fileUpload,
  getFile,
  getFiles,
  updateFile,
} from '../controller/file.controller';

const router = express.Router();

router.route('/').get(getFiles).post(createFile);
router.route('/delete-file-with-photo').post(deleteFileWithPhoto);
router.route('/delete-files-with-photo').post(deleteMultipleFilesWithPhoto);
router.route('/uploads').post(
  AuthGuard,
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
      name: 'popupImage',
      maxCount: 1,
    },
    {
      name: 'images',
      maxCount: 5,
    },
    {
      name: 'pdf',
      maxCount: 1,
    },
    {
      name: 'gif',
      maxCount: 1,
    },
    {
      name: 'mp4',
      maxCount: 1,
    },
    {
      name: 'pm3',
      maxCount: 1,
    },
  ]) as any,
  fileUpload,
);

router.route('/:id').get(getFile).put(updateFile).delete(deleteFile);

export default router;
