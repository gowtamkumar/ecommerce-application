import express from "express";
import {
  createSetting,
  dbBackup,
  deleteSetting,
  getSetting,
  getSettings,
  updateSetting,
} from "../controller/setting.controller";
import { AuthGuard } from "../../../../middlewares/auth.middleware";

const router = express.Router();

router.route("/").get(getSettings).post(AuthGuard, createSetting);
router.route("/db-backup").post(AuthGuard, dbBackup);

router
  .route("/:id")
  .get(AuthGuard, getSetting)
  .patch(AuthGuard, updateSetting)
  .delete(AuthGuard, deleteSetting);

export default router;
