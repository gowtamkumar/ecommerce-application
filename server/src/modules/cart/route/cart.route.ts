import express from "express";
import {
  createCart,
  deleteCart,
  getCart,
  getCarts,
  updateCart,
} from "../controller/cart.controller";

const router = express.Router();

router.route("/").get(getCarts).post(createCart);

router.route("/:id").get(getCart).patch(updateCart).delete(deleteCart);

export default router;
