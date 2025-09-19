import express from 'express';
import {
  createStockAdjust,
  deleteStockAdjust,
  getStockAdjust,
  getStockAdjusts,
} from '../controller/stock-adjust.controller';

const router = express.Router();

router.route('/').get(getStockAdjusts).post(createStockAdjust);

router.route('/:id').get(getStockAdjust).delete(deleteStockAdjust);

export default router;
