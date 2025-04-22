import express from "express";
import {
  createCategory,
  deleteCategory,
  getPublicCategories,
  getAntdCategories,
  getCategory,
  updateCategory,
  getCategories,
} from "../controller/categories.controller";
import { AuthGuard } from "../../../middlewares/auth.middleware";

const router = express.Router();

router.route("/").get(AuthGuard, getCategories).post(AuthGuard, createCategory);
router.route("/antd").get(getAntdCategories);
router.route("/all").get(getPublicCategories);// public api

router
  .route("/:id")
  .get(getCategory)
  .put(AuthGuard, updateCategory)
  .delete(AuthGuard, deleteCategory);

export default router;
