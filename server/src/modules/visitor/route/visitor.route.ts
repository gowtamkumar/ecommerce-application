import express from "express";
import {
  createVisitor,
  deleteVisitor,
  getVisitor,
  getVisitors,
  updateVisitor,
} from "../controller/visitor.controller";

const router = express.Router();

router.route("/").get(getVisitors).post(createVisitor);

router.route("/:id").get(getVisitor).put(updateVisitor).delete(deleteVisitor);

export default router;
