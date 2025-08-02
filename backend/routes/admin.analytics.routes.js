// routes/admin.analytics.routes.js
import express from 'express';
import {
  getDailyAnalytics,
  getAdminActions,
  getAllFlags,
} from '../controllers/admin.analytics.controller.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/analytics/daily', verifyAdmin, getDailyAnalytics);
router.get('/actions', verifyAdmin, getAdminActions);
router.get('/flags', verifyAdmin, getAllFlags);

export default router;
// This code defines the routes for admin analytics functionalities in the application.
// It includes routes for retrieving daily analytics, admin actions, and flagged issues.
