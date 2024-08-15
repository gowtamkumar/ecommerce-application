import express from "express";
import {
  createCurrency,
  deleteCurrency,
  getCurrency,
  getCurrencies,
  updateCurrency,
} from "../controller/currency.controller";

const router = express.Router();

router.route("/").get(getCurrencies).post(createCurrency);

router.route("/:id").get(getCurrency).patch(updateCurrency).delete(deleteCurrency);

export default router;
