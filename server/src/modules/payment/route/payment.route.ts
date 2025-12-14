import express from 'express';
import { AuthGuard } from '../../../middlewares/auth.middleware';
import {
  createDashboardPayment,
  createPayment,
  deletePayment,
  getPayment,
  getPayments,
  sslcommerzCancelHandler,
  sslcommerzFailHandler,
  sslcommerzSuccessHandler,
  updatePayment,
} from '../controller/payment.controller';

const router = express.Router();

router.route('/').get(getPayments).post(AuthGuard, createPayment);
router.route('/online').post(AuthGuard, createPayment);
router.route('/dashboard').post(AuthGuard, createDashboardPayment);
router.route('/success/:tranId').post(sslcommerzSuccessHandler);
router.route('/fail/:tranId').post(sslcommerzFailHandler);
router.route('/cancel/:tranId').post(sslcommerzCancelHandler);

router
  .route('/:id')
  .get(getPayment)
  .patch(AuthGuard, updatePayment)
  .delete(AuthGuard, deletePayment);

export default router;
