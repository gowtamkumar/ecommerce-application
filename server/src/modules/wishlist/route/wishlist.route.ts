import express from 'express';
import {
  createWishlist,
  deleteWishlist,
  getUserWishlist,
  getWishlist,
  getWishlists,
  updateWishlist,
} from '../controller/wishlist.controller';

const router = express.Router();

router.route('/').get(getWishlists).post(createWishlist);
router.route('/user-wishlist').get(getUserWishlist);

router.route('/:id').get(getWishlist).put(updateWishlist).delete(deleteWishlist);

export default router;
