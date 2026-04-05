import express from 'express';
import {
  createCoupon,
  deleteCoupon,
  getCoupon,
  getCoupons,
  updateCoupon,
} from '../controller/coupon.controller';
import { AuthGuard } from '@/middlewares/auth.middleware';

const router = express.Router();

router.route('/').get(getCoupons).post(AuthGuard, createCoupon);

router
  .route('/:id')
  .get(AuthGuard, getCoupon)
  .patch(AuthGuard, updateCoupon)
  .delete(AuthGuard, deleteCoupon);

export default router;
