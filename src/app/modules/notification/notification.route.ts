import express from 'express';
import { NotificationController } from './notification.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

// get my notifications
router.get('/me', auth(), NotificationController.getMyNotifications);

// read single notification by id
router.patch('/read/:id', auth(), NotificationController.readNotification);

// read all notifications
router.patch('/read-all', auth(), NotificationController.readAllNotifications);

export const notificationRoutes = router;
