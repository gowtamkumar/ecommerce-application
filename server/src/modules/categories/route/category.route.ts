import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategories,
  getCategory,
  updateCategory,
} from "../controller/categories.controller";

const router = express.Router();

router.route("/").get(getCategories).post(createCategory);
router.route("/all").get(getAllCategories);

router
  .route("/:id")
  .get(getCategory)
  .put(updateCategory)
  .delete(deleteCategory);

export default router;
