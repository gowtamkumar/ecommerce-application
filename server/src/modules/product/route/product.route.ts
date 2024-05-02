import express from "express";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
} from "../controller/product.controller";

const router = express.Router();

router.route("/").get(getProducts).post(createProduct);
// router.route("/active").get(getActiveProducts);
// router.route("/findbyname").get(getFindByName);
// router.route("/queryhelper").get(getQueryHelper);

router.route("/:id").get(getProduct).patch(updateProduct).delete(deleteProduct);

export default router;
