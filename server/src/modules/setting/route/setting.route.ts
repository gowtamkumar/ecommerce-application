import express from "express";
import { dbBackup } from "../controller/setting.controller";

const router = express.Router();

// router.route("/").get(getAddresses).post(createAddress);
router.route("/db-backup").post(dbBackup);

// router.route("/:id").get(getAddress).put(updateAddress).delete(deleteAddress);

export default router;
