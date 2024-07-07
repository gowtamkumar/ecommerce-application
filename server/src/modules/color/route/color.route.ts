import express from "express";
import {
  createColor,
  deleteColor,
  getColors,
  getColor,
  updateColor,
} from "../controller/color.controller";

const router = express.Router();

router.route("/").get(getColors).post(createColor);

router.route("/:id").get(getColor).put(updateColor).delete(deleteColor);

export default router;
