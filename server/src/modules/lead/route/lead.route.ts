import express from "express";
import {
  createLead,
  deleteLead,
  getLead,
  getLeads,
  updateLead,
} from "../controller/lead.controller";

const router = express.Router();

router.route("/").get(getLeads).post(createLead);

router.route("/:id").get(getLead).put(updateLead).delete(deleteLead);

export default router;
