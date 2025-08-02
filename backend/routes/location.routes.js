// routes/location.routes.js
import express from 'express';
import {
  getUserLocations,
  addUserLocation,
} from '../controllers/location.controller.js';
import { verifyAuth } from '../middlewares/auth.js';

const router = express.Router();

router.get('/user/:id', verifyAuth, getUserLocations);
router.post('/user/:id', verifyAuth, addUserLocation);

export default router;
// This code defines the routes for managing user locations in the application.
// It includes routes for retrieving and adding user locations. 

