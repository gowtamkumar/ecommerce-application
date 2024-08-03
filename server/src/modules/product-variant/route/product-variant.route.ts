import express from "express";
import {
  getProductVariant,
  createProductVariant,
  updateProductVariant,
  deleteProductVariant,
  getProductVariants,
} from "../controller/product-variant.controller";
import { AuthGuard } from "../../../middlewares/auth.middleware";

const router = express.Router();

router
  .route("/")
  .get(getProductVariants, AuthGuard)
  .post(createProductVariant, AuthGuard);

router
  .route("/:id")
  .get(getProductVariant)
  .patch(updateProductVariant, AuthGuard)
  .delete(deleteProductVariant, AuthGuard);

export default router;
