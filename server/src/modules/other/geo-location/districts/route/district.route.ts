import express from "express";
import {
  createDistrict,
  // deleteDistrict,
  getDistrict,
  getDistricts,
  // updateDistrict,
} from "../controller/district.controller";

const router = express.Router();

router.route("/").get(getDistricts).post(createDistrict);

router.route("/:id").get(getDistrict)
// .put(updateDistrict).delete(deleteDistrict);

export default router;
