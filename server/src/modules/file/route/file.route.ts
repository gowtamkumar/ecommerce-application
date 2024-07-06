import { upload } from "./../../../enums/fileUpload";
import express from "express";
import {
  createFile,
  fileUpload,
  deleteFile,
  getFile,
  getFiles,
  updateFile,
} from "../controller/file.controller";
import { AuthGuard } from "../../../middlewares/auth.middleware";

const router = express.Router();

router.route("/").get(getFiles).post(AuthGuard, createFile);
router.route("/upload").post(
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
  fileUpload
);

router.route("/:id").get(getFile).put(updateFile).delete(deleteFile);

export default router;
