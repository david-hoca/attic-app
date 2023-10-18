import express, { Router } from 'express';
import AdvertisementController from './advertisement.contr.js';
import authMiddleware from '../../middleware/auth.js';
import { superAdminMiddleware } from '../../middleware/admins.js';

const advertisementRouter: Router = express.Router();

// Create a new user
advertisementRouter.post('/create',authMiddleware, superAdminMiddleware, AdvertisementController.createAdvertisement);
// Get all users
advertisementRouter.get('/all', AdvertisementController.gatAllAdvertisements);
// Get user by ID
advertisementRouter.get('/:id', AdvertisementController.gatAdvertisementById);

// Update user by ID
advertisementRouter.put('/:id',authMiddleware, superAdminMiddleware, AdvertisementController.updateAdvertisement);
 
// Delete user by ID
advertisementRouter.delete('/:id',authMiddleware, superAdminMiddleware, AdvertisementController.deleteAdvertisement);

export default advertisementRouter;
