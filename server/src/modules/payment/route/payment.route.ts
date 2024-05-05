import express from "express";
import {
  createPayment,
  deletePayment,
  getAddres,
  getPayment,
  updatePayment,
} from "../controller/payment.controller";

const router = express.Router();

router.route("/").get(getPayment).post(createPayment);

router.route("/:id").get(getAddres).patch(updatePayment).delete(deletePayment);

export default router;
