// routes/location.routes.js
import express from 'express';
import {
  getUserLocations,
  addUserLocation,
} from '../controllers/location.controller.js';
import { verifyAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/:id/locations', verifyAuth, getUserLocations);
router.post('/:id/locations', verifyAuth, addUserLocation);

export default router;
// This code defines the routes for managing user locations in the application.
// It includes routes for retrieving and adding user locations. 

