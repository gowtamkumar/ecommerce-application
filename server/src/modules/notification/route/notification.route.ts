import express from "express";
import {
  createNotification,
  deleteNotification,
  getNotification,
  getNotifications,
  updateNotification,
} from "../controller/notification.controller";

const router = express.Router();

router.route("/").get(getNotifications).post(createNotification);

router.route("/:id").get(getNotification).put(updateNotification).delete(deleteNotification);

export default router;
