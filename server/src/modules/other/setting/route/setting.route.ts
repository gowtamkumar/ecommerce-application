import express from "express";
import { dbBackup } from "../controller/setting.controller";

const router = express.Router();

// router.route("/").get(getAddresses).post(createAddress);
router.route("/db-backup").post(dbBackup);

// router.route("/:id").get(getAddress).put(updateShippingAddress).delete(deleteShippingAddress);

export default router;
