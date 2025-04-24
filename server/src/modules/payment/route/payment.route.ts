import express from "express";
import {
  createPayment,
  deletePayment,
  getPayment,
  getPayments,
  sslcommerzCancelHandler,
  sslcommerzFailHandler,
  sslcommerzSuccessHandler,
  updatePayment,
} from "../controller/payment.controller";
import { AuthGuard } from "../../../middlewares/auth.middleware";

const router = express.Router();

router.route("/").get(getPayments).post(createPayment);
router.route("/dashboard").post(createPayment);
router.route("/success").get(sslcommerzSuccessHandler);
router.route("/fail").get(sslcommerzFailHandler);
router.route("/cancel").get(sslcommerzCancelHandler);

router
  .route("/:id")
  .get(getPayment)
  .patch(AuthGuard, updatePayment)
  .delete(AuthGuard, deletePayment);

export default router;
