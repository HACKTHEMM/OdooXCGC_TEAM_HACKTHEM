// routes/admin.routes.js
import express from 'express';
import {
  getAllUsers,
  banUser,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getFlaggedIssues,
  hideFlaggedIssue,
  deleteIssue,
  getAnalyticsSummary,
} from '../controllers/admin.controller.js';

import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/users', verifyAdmin, getAllUsers);
router.patch('/users/:id/ban', verifyAdmin, banUser);
router.get('/categories', verifyAdmin, getCategories);
router.post('/categories', verifyAdmin, createCategory);
router.patch('/categories/:id', verifyAdmin, updateCategory);
router.delete('/categories/:id', verifyAdmin, deleteCategory);
router.get('/issues/flagged', verifyAdmin, getFlaggedIssues);
router.patch('/issues/:id/hide', verifyAdmin, hideFlaggedIssue);
router.delete('/issues/:id/delete', verifyAdmin, deleteIssue);
router.get('/analytics/summary', verifyAdmin, getAnalyticsSummary);

export default router;

// This code defines the routes for the admin functionalities in the application.
// It includes routes for managing users, categories, flagged issues, and analytics.
// Each route is protected by the `verifyAdmin` middleware to ensure that only admin users can access them.
