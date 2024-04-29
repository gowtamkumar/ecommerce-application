import express from "express";
import {
  createAddress,
  deleteAddress,
  getAddres,
  getAddress,
  updateAddress,
} from "../controller/address.controller";

const router = express.Router();

router.route("/").get(getAddress).post(createAddress);

router.route("/:id").get(getAddres).put(updateAddress).delete(deleteAddress);

export default router;
