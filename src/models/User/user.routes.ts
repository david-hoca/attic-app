import express, { Router } from 'express';
import UserController from './user.contr.js';

const userRouter: Router = express.Router();

// Create a new user
userRouter.post('/create', UserController.createUser);

// Get all users
userRouter.get('/all', UserController.getAllUsers);

// Get user by ID
userRouter.get('/:id', UserController.getUserById);

// Update user by ID
userRouter.put('/:id', UserController.updateUser);

// Delete user by ID
userRouter.delete('/:id', UserController.deleteUser);

export default userRouter;
