import express from 'express';
import { AuthGuard } from '../../../middlewares/auth.middleware';
import {
  createPage,
  deletePage,
  getPage,
  getPageBySlug,
  getPages,
  updatePage,
} from '../controller/page.controller';

const router = express.Router();

router.route('/').get(getPages).post(AuthGuard, createPage);
router
  .route('/:id')
  .get(getPage)
  .put(AuthGuard, updatePage)
  .delete(AuthGuard, deletePage);
router.route('/slug/:slug').get(getPageBySlug);

export default router;
