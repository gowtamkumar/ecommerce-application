import express from "express";
import {
  createPayment,
  deletePayment,
  getPayment,
  getPayments,
  updatePayment,
} from "../controller/payment.controller";

const router = express.Router();

router.route("/").get(getPayments).post(createPayment);

router.route("/:id").get(getPayment).patch(updatePayment).delete(deletePayment);

export default router;
