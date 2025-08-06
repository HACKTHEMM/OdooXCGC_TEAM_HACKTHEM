import express from 'express';
import {
  registerUser,
  loginUser,
  getMyProfile,
  createAdminRole,
  updateAdminRole,
  removeAdminRole,
  checkAdminStatus
} from '../controllers/user.controller.js';
import { verifyAuth } from '../middlewares/auth.js';
import { requireAdmin, requireSuperAdmin } from '../middlewares/authorization.js';
import { validateSignup, validateLogin } from '../middlewares/validateUserInput.js';

const router = express.Router();

// Public routes
router.post('/register', validateSignup, registerUser);
router.post('/login', validateLogin, loginUser);

// Protected user routes
router.get('/me', verifyAuth, getMyProfile);

// Admin role management routes (require authentication and admin privileges)
router.post('/create-admin', verifyAuth, requireSuperAdmin, createAdminRole);
router.patch('/update-admin-role/:id', verifyAuth, requireSuperAdmin, updateAdminRole);
router.delete('/remove-admin/:id', verifyAuth, requireSuperAdmin, removeAdminRole);
router.get('/check-admin-status/:id', verifyAuth, requireAdmin, checkAdminStatus);

export default router;
