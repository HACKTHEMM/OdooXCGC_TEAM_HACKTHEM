import express from 'express';
import {
  registerUser,
  loginUser,
  getMyProfile,
} from '../controllers/user.controller.js';
import { verifyAuth } from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', verifyAuth, getMyProfile);

export default router;
