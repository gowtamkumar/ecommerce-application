import express from "express";
import {
  createReview,
  deleteReview,
  getReview,
  getReviews,
  updateReview,
  reviewLike,
  reviewDisLike,
} from "../controller/review.controller";

const router = express.Router();

router.route("/").get(getReviews).post(createReview);

router.route("/:id").get(getReview).patch(updateReview).delete(deleteReview);
router.route("/like/:id").patch(reviewLike);
router.route("/dislike/:id").patch(reviewDisLike);

export default router;
