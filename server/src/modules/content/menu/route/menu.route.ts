import express from 'express';
import { AuthGuard } from '@/middlewares/auth.middleware';
import {
  createMemu,
  deleteMemu,
  getDashboardMemus,
  getMemu,
  getMemus,
  updateMemu,
} from '../controller/menu.controller';

const router = express.Router();

router.route('/dashboard').get(AuthGuard, getDashboardMemus);
router.route('/').get(getMemus).post(AuthGuard, createMemu);

router.route('/:id').get(getMemu).patch(AuthGuard, updateMemu).delete(AuthGuard, deleteMemu);

export default router;
