import express from "express";
import {
  createShippingAddress,
  deleteShippingAddress,
  getShippingAddress,
  getShippingAddresses,
  getUserShippingAddresses,
  updateShippingAddress,
} from "../controller/shipping-address.controller";

const router = express.Router();

router.route("/").get(getShippingAddresses).post(createShippingAddress);
router.route("/user").get(getUserShippingAddresses);

router
  .route("/:id")
  .get(getShippingAddress)
  .put(updateShippingAddress)
  .delete(deleteShippingAddress);

export default router;
