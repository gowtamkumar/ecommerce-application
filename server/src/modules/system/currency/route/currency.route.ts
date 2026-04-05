import express from 'express';
import { AuthGuard } from '@/middlewares/auth.middleware';
import {
  createCurrency,
  deleteCurrency,
  getCurrencies,
  getCurrency,
  updateCurrency,
} from '../controller/currency.controller';

const router = express.Router();

router.route('/').get(getCurrencies).post(AuthGuard, createCurrency);

router
  .route('/:id')
  .get(getCurrency)
  .patch(AuthGuard, updateCurrency)
  .delete(AuthGuard, deleteCurrency);

export default router;
