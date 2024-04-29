import express from "express";
import {
  createWishlist,
  deleteWishlist,
  getWishlist,
  getWishlists,
  updateWishlist,
} from "../controller/wishlist.controller";

const router = express.Router();

router.route("/").get(getWishlists).post(createWishlist);

router
  .route("/:id")
  .get(getWishlist)
  .put(updateWishlist)
  .delete(deleteWishlist);

export default router;
