import express from "express";
import {
  createProductCategory,
  deleteProductCategory,
  getProductCategory,
  getProductCategorys,
  updateProductCategory,
} from "../controller/product-category.controller";

const router = express.Router();

router.route("/").get(getProductCategorys).post(createProductCategory);

router
  .route("/:id")
  .get(getProductCategory)
  .put(updateProductCategory)
  .delete(deleteProductCategory);

export default router;
