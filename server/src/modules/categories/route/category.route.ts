import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategories,
  getCategory,
  updateCategory,
} from "../controller/categories.controller";
import { AuthGuard } from "../../../middlewares/auth.middleware";

const router = express.Router();

router.route("/").get(getCategories).post(AuthGuard, createCategory);
router.route("/all").get(getAllCategories);

router
  .route("/:id")
  .get(getCategory)
  .put(AuthGuard, updateCategory)
  .delete(AuthGuard, deleteCategory);

export default router;
