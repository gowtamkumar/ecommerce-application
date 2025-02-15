import express from "express";
import {
  createLead,
  deleteLead,
  getLead,
  getLeads,
  updateLead,
} from "../controller/lead.controller";
import { AuthGuard } from "../../../middlewares/auth.middleware";

const router = express.Router();

router.route("/").get(AuthGuard, getLeads).post(createLead);

router
  .route("/:id")
  .get(AuthGuard, getLead)
  .put(AuthGuard, updateLead)
  .delete(AuthGuard, deleteLead);

export default router;
