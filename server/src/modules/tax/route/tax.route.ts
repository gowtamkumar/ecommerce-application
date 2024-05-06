import express from "express";
import {
  createTax,
  deleteTax,
  getTax,
  getTaxs,
  updateTax,
} from "../controller/tax.controller";

const router = express.Router();

router.route("/").get(getTaxs).post(createTax);

router.route("/:id").get(getTax).put(updateTax).delete(deleteTax);

export default router;
