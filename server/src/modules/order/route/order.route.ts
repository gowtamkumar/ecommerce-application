import express from "express";
import {
  createOrder,
  deleteOrder,
  getOrder,
  getOrders,
  orderStatusUpdate,
  updateOrder,
} from "../controller/order.controller";

const router = express.Router();

router.route("/").get(getOrders).post(createOrder);

router.route("/:id").get(getOrder).patch(updateOrder).delete(deleteOrder);
router.route("/order-status-update/:id").patch(orderStatusUpdate);

export default router;
