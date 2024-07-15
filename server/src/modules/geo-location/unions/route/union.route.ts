import express from "express";
import {
  createUnion,
  // deleteUnion,
  getUnion,
  getUnions,
  // updateUnion,
} from "../controller/union.controller";

const router = express.Router();

router.route("/").get(getUnions).post(createUnion);

router.route("/:id").get(getUnion)
// .put(updateUnion).delete(deleteUnion);

export default router;
