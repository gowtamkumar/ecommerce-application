import express from "express";
import {
  getDashboardReport,
  getTopSellingProduct,
} from "../controller/report.controller";

const router = express.Router();

router.route("/dashboard").get(getDashboardReport);
router.route("/top-selling-products").get(getTopSellingProduct);

export default router;
