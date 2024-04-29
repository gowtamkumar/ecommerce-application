import express from "express";
import {
  getProductVariant,
  createProductVariant,
  updateProductVariant,
  deleteProductVariant,
} from "../controller/product-variant.controller";

const router = express.Router();

router.route("/").get(getProductVariant).post(createProductVariant);

router
  .route("/:id")
  .get(getProductVariant)
  .put(updateProductVariant)
  .delete(deleteProductVariant);

export default router;
