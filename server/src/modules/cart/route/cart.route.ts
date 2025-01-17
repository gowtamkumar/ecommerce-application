import express from "express";
import {
  createCart,
  deleteCart,
  getCart,
  getCartByUser,
  getCartList,
  getCarts,
  updateCart,
} from "../controller/cart.controller";

const router = express.Router();

router.route("/").get(getCarts).post(createCart);
router.route("/user").get(getCartByUser);
router.route("/list").get(getCartList);

router.route("/:id").get(getCart).patch(updateCart).delete(deleteCart);

export default router;
