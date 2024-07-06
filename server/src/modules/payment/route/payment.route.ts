import express from "express";
import {
  createPayment,
  deletePayment,
  getPayment,
  getPayments,
  updatePayment,
} from "../controller/payment.controller";
import { AuthGuard } from "../../../middlewares/auth.middleware";

const router = express.Router();

router.route("/").get(getPayments).post(createPayment);

router
  .route("/:id")
  .get(getPayment)
  .patch(AuthGuard, updatePayment)
  .delete(AuthGuard, deletePayment);

export default router;
