// routes/issue.routes.js
import express from 'express';
import {
  createIssue,
  getIssues,
  getIssueById,
  updateIssueStatus,
  flagIssue,
  upvoteIssue,
  downvoteIssue,
  getNearbyIssues,
  getIssuesMapPins,
  addComment,
  getIssueComments,
  getIssuePhotos,
  uploadIssuePhotos,
  getStatusLog,
  getPublicStats,
  getPublicCategories,
} from '../controllers/issue.controller.js';

import { verifyAuth, verifyAdminOrAgent } from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.get('/', getIssues);
router.get('/stats', getPublicStats);
router.get('/categories', getPublicCategories);
router.get('/map/pins', getIssuesMapPins);
router.get('/nearby', getNearbyIssues);
router.post('/', verifyAuth, upload.array('images', 5), createIssue);
router.get('/:id', getIssueById);
router.get('/:id/photos', getIssuePhotos);
router.post('/:id/photos', verifyAuth, upload.array('photos', 5), uploadIssuePhotos);
router.get('/:id/comments', getIssueComments);
router.post('/:id/comment', verifyAuth, addComment);
router.get('/:id/status-log', getStatusLog);
router.patch('/:id/status', verifyAdminOrAgent, updateIssueStatus);
router.post('/:id/flag', verifyAuth, flagIssue);
router.post('/:id/upvote', verifyAuth, upvoteIssue);
router.post('/:id/downvote', verifyAuth, downvoteIssue);

export default router;

// This code defines the routes for managing issues in the application.
// It includes routes for creating, retrieving, updating, and flagging issues.

