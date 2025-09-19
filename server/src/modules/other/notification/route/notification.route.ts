import express from 'express';
import {
  clearNotification,
  createNotification,
  deleteNotification,
  getNotification,
  getNotifications,
  readNotification,
  updateNotification,
} from '../controller/notification.controller';

const router = express.Router();

router.route('/read/:id').get(readNotification);
router.route('/clear').get(clearNotification);
router.route('/').get(getNotifications).post(createNotification);

router.route('/:id').get(getNotification).put(updateNotification).delete(deleteNotification);

export default router;
