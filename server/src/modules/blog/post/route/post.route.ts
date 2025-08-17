import express from "express";
import { AuthGuard } from "../../../../middlewares/auth.middleware";
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from "../controller/post.controller";

const router = express.Router();

router.route("/").get(getPosts).post(AuthGuard, createPost);
router.route("/:slug").get(getPost);
router
  .route("/:id")
  // .get(getPost)
  .put(AuthGuard, updatePost)
  .delete(AuthGuard, deletePost);

export default router;
