// routes/notification.routes.js
import express from 'express';
import {
  getNotifications,
  markNotificationRead,
} from '../controllers/notification.controller.js';
import { verifyAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyAuth, getNotifications);
router.patch('/:id/read', verifyAuth, markNotificationRead);

export default router;


