import express from "express";
import {
  completeFullOrderReturn,
  createReturn,
  deleteReturn,
  getReturn,
  getReturns,
  requestFullOrderReturn,
  updateReturn,
} from "../controller/return.controller";

const router = express.Router();

router.route("/").get(getReturns).post(createReturn);
router.route("/full-request/:orderId").get(requestFullOrderReturn);
router.route("/full-complete/:orderId").get(completeFullOrderReturn);

router.route("/:id").get(getReturn).put(updateReturn).delete(deleteReturn);

export default router;
