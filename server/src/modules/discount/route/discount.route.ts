import express from "express";
import {
  createDiscount,
  deleteDiscount,
  getDiscount,
  getDiscounts,
  updateDiscount,
} from "../controller/discount.controller";

const router = express.Router();

router.route("/").get(getDiscounts).post(createDiscount);

router
  .route("/:id")
  .get(getDiscount)
  .patch(updateDiscount)
  .delete(deleteDiscount);

export default router;
