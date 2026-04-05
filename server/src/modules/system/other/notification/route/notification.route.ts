import express from 'express';
import { AuthGuard, isAuthorize } from '@/middlewares/auth.middleware';
import { RoleEnum } from '@/modules/user/auth/enums';
import {
  clearNotification,
  createNotification,
  deleteNotification,
  getNotification,
  getNotifications,
  getNotificationsForAdmin,
  readNotification,
  sendPromotionalNotification,
  updateNotification,
} from '../controller/notification.controller';

const router = express.Router();

router.route('/read/:id').get(readNotification);
router.route('/clear').get(clearNotification);
router.route('/promote').post(AuthGuard, isAuthorize(RoleEnum.Admin), sendPromotionalNotification);
router.route('/').get(getNotifications).post(createNotification);
router.route('/admin').get(getNotificationsForAdmin);

router.route('/:id').get(getNotification).put(updateNotification).delete(deleteNotification);

export default router;
