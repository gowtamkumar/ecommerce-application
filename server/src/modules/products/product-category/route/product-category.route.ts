import express from 'express';
import {
  createProductCategory,
  deleteProductCategory,
  getProductCategories,
  getProductCategory,
  updateProductCategory,
} from '../controller/product-category.controller';

const router = express.Router();

router.route('/').get(getProductCategories).post(createProductCategory);

router
  .route('/:id')
  .get(getProductCategory)
  .put(updateProductCategory)
  .delete(deleteProductCategory);

export default router;
