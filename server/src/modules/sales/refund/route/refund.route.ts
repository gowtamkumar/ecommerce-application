import express from 'express';
import {
  getRefunds,
  getRefund,
  completeRefund,
} from '../controller/refund.controller';

const router = express.Router();

router.route('/').get(getRefunds);
router.route('/:id').get(getRefund);
router.route('/:id/complete').put(completeRefund);

export default router;
