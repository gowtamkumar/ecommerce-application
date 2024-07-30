import express from "express";
import {
  createShippingCharge,
  deleteShippingCharge,
  getShippingCharge,
  getShippingCharges,
  updateShippingCharge,
} from "../controller/shipping-charge.controller";

const router = express.Router();

router.route("/").get(getShippingCharges).post(createShippingCharge);

router
  .route("/:id")
  .get(getShippingCharge)
  .patch(updateShippingCharge)
  .delete(deleteShippingCharge);

export default router;
