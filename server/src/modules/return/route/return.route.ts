import express from "express";
import {
  createReturn,
  deleteReturn,
  getReturn,
  getReturns,
  updateReturn,
} from "../controller/return.controller";

const router = express.Router();

router.route("/").get(getReturns).post(createReturn);

router.route("/:id").get(getReturn).put(updateReturn).delete(deleteReturn);

export default router;
