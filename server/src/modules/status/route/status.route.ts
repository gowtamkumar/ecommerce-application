import express from "express";
import {
  createStatus,
  deleteStatus,
  getStatus,
  getStatuses,
  updateStatus,
} from "../controller/status.controller";

const router = express.Router();

router.route("/").get(getStatuses).post(createStatus);

router.route("/:id").get(getStatus).put(updateStatus).delete(deleteStatus);

export default router;
