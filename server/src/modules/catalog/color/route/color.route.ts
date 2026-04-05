import express from 'express';
import {
  createColor,
  deleteColor,
  getColors,
  getColor,
  updateColor,
} from '../controller/color.controller';
import { AuthGuard } from '@/middlewares/auth.middleware';

const router = express.Router();

router.route('/').get(getColors).post(AuthGuard, createColor);

router.route('/:id').get(getColor).put(AuthGuard, updateColor).delete(AuthGuard, deleteColor);

export default router;
