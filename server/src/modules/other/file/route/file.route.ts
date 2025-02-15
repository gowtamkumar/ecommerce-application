import express from "express";
import {
  createFile,
  fileUpload,
  deleteFile,
  getFile,
  getFiles,
  updateFile,
  deleteFileWithPhoto,
} from "../controller/file.controller";
import { AuthGuard } from "../../../../middlewares/auth.middleware";
import { upload } from "../../../../middlewares/fileUpload";

const router = express.Router();

router.route("/").get(getFiles).post(createFile);
router.route("/delete-file-with-photo").post(deleteFileWithPhoto);
router.route("/uploads").post(
  upload.fields([
    {
      name: "thumbnailImage",
      maxCount: 1,
    },
    {
      name: "hoverImage",
      maxCount: 1,
    },
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "images",
      maxCount: 5,
    },
  ]),
  AuthGuard,
  fileUpload
);

router.route("/:id").get(getFile).put(updateFile).delete(deleteFile);

export default router;
