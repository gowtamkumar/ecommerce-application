import express from "express";
import {
  getProductVariant,
  createProductVariant,
  updateProductVariant,
  deleteProductVariant,
  getProductVariants,
} from "../controller/product-variant.controller";

const router = express.Router();

router.route("/").get(getProductVariants).post(createProductVariant);

router
  .route("/:id")
  .get(getProductVariant)
  .patch(updateProductVariant)
  .delete(deleteProductVariant);

export default router;
