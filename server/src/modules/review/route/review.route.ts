import express from "express";
import {
  createReview,
  deleteReview,
  getReview,
  getReviews,
  updateReview,
} from "../controller/review.controller";

const router = express.Router();

router.route("/").get(getReviews).post(createReview);

router.route("/:id").get(getReview).patch(updateReview).delete(deleteReview);

export default router;
