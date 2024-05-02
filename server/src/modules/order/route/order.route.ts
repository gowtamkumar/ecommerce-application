import express from "express";
import {
  createOrder,
  deleteOrder,
  getOrder,
  getOrders,
  updateOrder,
} from "../controller/order.controller";

const router = express.Router();

router.route("/").get(getOrders).post(createOrder);

router.route("/:id").get(getOrder).patch(updateOrder).delete(deleteOrder);

export default router;
