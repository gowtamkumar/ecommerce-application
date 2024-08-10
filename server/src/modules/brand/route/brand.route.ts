import express from "express";
import {
  createBrand,
  deleteBrand,
  getBrand,
  getBrands,
  updateBrand,
} from "../controller/brand.controller";
import { AuthGuard } from "../../../middlewares/auth.middleware";

const router = express.Router();

router.route("/").get(getBrands).post(AuthGuard, createBrand);

router
  .route("/:id")
  .get(getBrand)
  .patch(AuthGuard, updateBrand)
  .delete(AuthGuard, deleteBrand);

export default router;
