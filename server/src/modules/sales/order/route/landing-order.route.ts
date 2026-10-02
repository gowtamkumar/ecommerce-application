import express from 'express';
import {
  directLandingOrder,
  getLandingProduct,
} from '../controller/landing-order.controller';

const router = express.Router();

router.route('/product/:slug').get(getLandingProduct);
router.route('/order').post(directLandingOrder);

export default router;
