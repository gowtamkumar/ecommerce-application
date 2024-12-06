import express from "express";
import {
  createProductColor,
  deleteProductColor,
  getProductColors,
  getProductColor,
  updateProductColor,
} from "../controller/product-color.controller";

const router = express.Router();

router.route("/").get(getProductColors).post(createProductColor);

router
  .route("/:id")
  .get(getProductColor)
  .put(updateProductColor)
  .delete(deleteProductColor);

export default router;
