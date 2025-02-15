import express from "express";
import {
  createUnit,
  deleteUnit,
  getUnit,
  getUnits,
  updateUnit,
} from "../controller/unit.controller";

const router = express.Router();

router.route("/").get(getUnits).post(createUnit);

router.route("/:id").get(getUnit).put(updateUnit).delete(deleteUnit);

export default router;
