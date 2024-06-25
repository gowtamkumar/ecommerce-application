import express from "express";
import {
  createBrand,
  deleteBrand,
  getBrand,
  getBrands,
  updateBrand,
} from "../controller/brand.controller";

const router = express.Router();

router.route("/").get(getBrands).post(createBrand);

router
  .route("/:id")
  .get(getBrand)
  .patch(updateBrand)
  .delete(deleteBrand);

export default router;
