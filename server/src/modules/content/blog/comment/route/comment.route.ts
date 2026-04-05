import express from 'express';
import {
  createComment,
  deleteComment,
  getComment,
  getComments,
  updateComment,
  commentLike,
  commentDisLike,
} from '../controller/comment.controller';

const router = express.Router();

router.route('/').get(getComments).post(createComment);

router.route('/:id').get(getComment).patch(updateComment).delete(deleteComment);
router.route('/like/:id').patch(commentLike);
router.route('/dislike/:id').patch(commentDisLike);

export default router;
