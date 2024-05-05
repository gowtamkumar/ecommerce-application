import express from "express";
import {
  createOrderTracking,
  deleteOrderTracking,
  getOrderTracking,
  getOrderTrackings,
  updateOrderTracking,
} from "../controller/order-tracking.controller";

const router = express.Router();

router.route("/").get(getOrderTrackings).post(createOrderTracking);

router
  .route("/:id")
  .get(getOrderTracking)
  .patch(updateOrderTracking)
  .delete(deleteOrderTracking);

export default router;
