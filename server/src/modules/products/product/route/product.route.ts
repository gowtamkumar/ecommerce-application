import express from "express";
import {
  getPublicProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getProductByslug,
  getDashboardProducts,
} from "../controller/product.controller";
import { AuthGuard } from "../../../../middlewares/auth.middleware";

const router = express.Router();

router.route("/").get(getPublicProducts).post(AuthGuard, createProduct);
router.route("/dashboard").get(AuthGuard, getDashboardProducts);

// router.route("/active").get(getActiveProducts);
// router.route("/findbyname").get(getFindByName);
// router.route("/queryhelper").get(getQueryHelper);
router.route("/slug/:slug").get(getProductByslug);
router
  .route("/:id")
  .get(getProduct)
  .patch(AuthGuard, updateProduct)
  .delete(AuthGuard, deleteProduct);

export default router;
