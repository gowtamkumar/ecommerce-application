import express from "express";
import {
  createDivision,
  // deleteDivision,
  getDivision,
  getDivisions,
  // updateDivision,
} from "../controller/division.controller";

const router = express.Router();

router.route("/").get(getDivisions).post(createDivision);

router.route("/:id").get(getDivision)
// .put(updateDivision).delete(deleteDivision);

export default router;
