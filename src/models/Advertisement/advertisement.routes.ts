import express, { Router } from 'express';
import AdvertisementController from './advertisement.contr.js';

const advertisementRouter: Router = express.Router();

// Create a new user
advertisementRouter.post('/create', AdvertisementController.createAdvertisement);

// Get all users
advertisementRouter.get('/all', AdvertisementController.gatAllAdvertisements);

// Get user by ID
advertisementRouter.get('/:id', AdvertisementController.gatAdvertisementById);

// Update user by ID
advertisementRouter.put('/:id', AdvertisementController.updateAdvertisement);

// Delete user by ID
advertisementRouter.delete('/:id', AdvertisementController.deleteAdvertisement);

export default advertisementRouter;
