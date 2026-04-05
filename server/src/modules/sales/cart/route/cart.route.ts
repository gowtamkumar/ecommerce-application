import express from 'express';
import {
  cartListApplyCoupon,
  cartIncrementDecrement,
  createCart,
  deleteCart,
  getCart,
  // getCartByUser,
  getCarts,
  updateCart,
} from '../controller/cart.controller';
import { AuthGuard } from '@/middlewares/auth.middleware';

const router = express.Router();

router.route('/').get(getCarts).post(createCart);
// router.route("/user").get(getCartByUser);
// router.route("/list").get(getCartList);
router.route('/coupon-apply-cartlist').get(cartListApplyCoupon);
router.route('/qty-up-down/:id').put(AuthGuard, cartIncrementDecrement);
router.route('/:id').get(getCart).patch(updateCart).delete(deleteCart);

export default router;
