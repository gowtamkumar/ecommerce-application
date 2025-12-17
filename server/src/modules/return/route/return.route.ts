import express from 'express';
import {
  completeFullOrderReturn,
  createReturn,
  deleteReturn,
  getReturn,
  getReturns,
  requestFullOrderReturn,
  singleProductReturn,
  updateReturn,
} from '../controller/return.controller';

const router = express.Router();

router.route('/').get(getReturns).post(createReturn);
router.route('/full-request').post(requestFullOrderReturn);
router.route('/full-complete/:orderId').get(completeFullOrderReturn);

router.route('/single-product/:orderItemId').put(singleProductReturn);
router.route('/:id').get(getReturn).put(updateReturn).delete(deleteReturn);

export default router;
