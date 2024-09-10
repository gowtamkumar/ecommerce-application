import express from "express";
import {
  createCurrency,
  deleteCurrency,
  getCurrency,
  getCurrencies,
  updateCurrency,
} from "../controller/currency.controller";
import { AuthGuard } from "../../../middlewares/auth.middleware";

const router = express.Router();

router.route("/").get(AuthGuard, getCurrencies).post(AuthGuard, createCurrency);

router
  .route("/:id")
  .get(AuthGuard, getCurrency)
  .patch(AuthGuard, updateCurrency)
  .delete(AuthGuard, deleteCurrency);

export default router;
