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
import { upload } from "../../../../enums/fileUpload";

const router = express.Router();

router.route("/").get(getFiles).post(AuthGuard, createFile);
router.route("/delete-file-with-photo").post(deleteFileWithPhoto);
router.route("/uploads").post(
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "images",
      maxCount: 2,
    },
  ]),
  AuthGuard,
  fileUpload
);

router.route("/:id").get(getFile).put(updateFile).delete(deleteFile);

export default router;
