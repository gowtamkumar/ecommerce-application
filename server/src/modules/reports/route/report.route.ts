import express from "express";
import { getDashboardReport } from "../controller/report.controller";

const router = express.Router();

router.route("/dashboard").get(getDashboardReport);

export default router;
