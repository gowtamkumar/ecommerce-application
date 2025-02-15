import express from "express";
import {
  createSize,
  deleteSize,
  getSize,
  getSizes,
  updateSize,
} from "../controller/size.controller";

const router = express.Router();

router.route("/").get(getSizes).post(createSize);

router.route("/:id").get(getSize).put(updateSize).delete(deleteSize);

export default router;
