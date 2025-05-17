import express from "express";
import {
  createDiscount,
  deleteDiscount,
  discountStatusUpdate,
  getDiscount,
  getDiscountBySlug,
  getDiscountDetails,
  getDiscounts,
  updateDiscount,
} from "../controller/discount.controller";
import { AuthGuard } from "../../../middlewares/auth.middleware";

const router = express.Router();

router.route("/").get(getDiscounts).post(AuthGuard, createDiscount);
router.route("/slug/:slug").get(getDiscountBySlug);
router.route("/details/:id").get(getDiscountDetails);
router.route("/status/:id").patch(discountStatusUpdate);
router
  .route("/:id")
  .get(AuthGuard, getDiscount)

  .patch(AuthGuard, updateDiscount)
  .delete(AuthGuard, deleteDiscount);

export default router;
