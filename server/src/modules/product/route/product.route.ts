import express from "express";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
} from "../controller/product.controller";
import { AuthGuard } from "../../../middlewares/auth.middleware";

const router = express.Router();

router.route("/").get(getProducts).post(AuthGuard, createProduct);
// router.route("/active").get(getActiveProducts);
// router.route("/findbyname").get(getFindByName);
// router.route("/queryhelper").get(getQueryHelper);

router
  .route("/:id")
  .get(getProduct)
  .patch(AuthGuard, updateProduct)
  .delete(AuthGuard, deleteProduct);

export default router;
