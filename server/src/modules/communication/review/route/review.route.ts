import { AuthGuard } from '@/middlewares/auth.middleware';
import express from 'express';
import {
  createReview,
  deleteReview,
  getReview,
  getReviews,
  reviewDisLike,
  reviewLike,
  updateReview,
} from '../controller/review.controller';

const router = express.Router();

router.route('/').get(getReviews).post(AuthGuard, createReview);

router.route('/:id').get(getReview).patch(AuthGuard, updateReview).delete(AuthGuard, deleteReview);
router.route('/like/:id').patch(AuthGuard, reviewLike);
router.route('/dislike/:id').patch(AuthGuard, reviewDisLike);

export default router;
