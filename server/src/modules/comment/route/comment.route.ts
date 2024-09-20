import express from "express";
import {
  createComment,
  deleteComment,
  getComment,
  getComments,
  updateComment,
  CommentLike,
  CommentDisLike,
} from "../controller/comment.controller";

const router = express.Router();

router.route("/").get(getComments).post(createComment);

router.route("/:id").get(getComment).patch(updateComment).delete(deleteComment);
router.route("/like/:id").patch(CommentLike);
router.route("/dislike/:id").patch(CommentDisLike);

export default router;
