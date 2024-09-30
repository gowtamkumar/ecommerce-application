import express from "express";
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from "../controller/post.controller";
import { AuthGuard } from "../../../middlewares/auth.middleware";

const router = express.Router();

router.route("/").get(getPosts).post(AuthGuard, createPost);

router
  .route("/:id")
  .get(getPost)
  .put(AuthGuard, updatePost)
  .delete(AuthGuard, deletePost);

export default router;
