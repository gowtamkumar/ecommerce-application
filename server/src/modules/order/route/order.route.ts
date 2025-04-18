import express from "express";
import {
  assignDeliveryMan,
  createOrder,
  deleteOrder,
  getOrder,
  getOrders,
  getUserOrders,
  orderReview,
  orderStatusUpdate,
  getOrderTracking,
  updateOrder,
} from "../controller/order.controller";

const router = express.Router();

router.route("/").get(getOrders).post(createOrder);

router.route("/user").get(getUserOrders);
router.route("/tracking").get(getOrderTracking);
router.route("/:id").get(getOrder).patch(updateOrder).delete(deleteOrder);
router.route("/order-status-update/:id").patch(orderStatusUpdate);
router.route("/assign/:id").patch(assignDeliveryMan);
router.route("/review/:id").patch(orderReview); //need to check is this api use?

export default router;
