import express from "express";
import {
  createUpazila,
  // deleteUpazila,
  getUpazila,
  getUpazilas,
  // updateUpazila,
} from "../controller/upazila.controller";

const router = express.Router();

router.route("/").get(getUpazilas).post(createUpazila);

router.route("/:id").get(getUpazila);
// .put(updateUpazila).delete(deleteUpazila);

export default router;
