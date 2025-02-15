import express from "express";
import {
  createBanner,
  deleteBanner,
  getBanner,
  getBanners,
  updateBanner,
} from "../controller/banner.controller";
import { AuthGuard } from "../../../middlewares/auth.middleware";

const router = express.Router();

router.route("/").get(getBanners).post(AuthGuard, createBanner);

router
  .route("/:id")
  .get(getBanner)
  .patch(AuthGuard, updateBanner)
  .delete(AuthGuard, deleteBanner);

export default router;
