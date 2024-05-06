import express from "express";
import {
  createAddress,
  deleteAddress,
  getAddress,
  getAddresses,
  updateAddress,
} from "../controller/address.controller";

const router = express.Router();

router.route("/").get(getAddresses).post(createAddress);

router.route("/:id").get(getAddress).put(updateAddress).delete(deleteAddress);

export default router;
