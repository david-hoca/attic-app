import express, { Request, Response } from 'express';
import UserModel from './user.model.js';
import { IUser } from './user.interface';
import handleError from '../../utils/catchError.js';

class UserController {
    // Create a new user
    public createUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const user: IUser = new UserModel(req.body);
            const newUser = await user.save();
            res.status(201).json(newUser);
        } catch (error: any) {
            handleError(res, error)
        }
    };

    // Get all users
    public getAllUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const users = await UserModel.find();
            res.status(200).json(users);
        } catch (error: any) {
            handleError(res, error)
        }
    };

    // Get user by ID
    public getUserById = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        try {
            const user = await UserModel.findById(id);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.status(200).json(user);
        } catch (error: any) {
            handleError(res, error)
        }
    };

    // Update user by ID
    public updateUser = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        try {
            const updatedUser = await UserModel.findByIdAndUpdate(id, req.body, { new: true });
            if (!updatedUser) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.status(200).json(updatedUser);
        } catch (error: any) {
            handleError(res, error)
        }
    };

    // Delete user by ID
    public deleteUser = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        try {
            const deletedUser = await UserModel.findByIdAndDelete(id);
            if (!deletedUser) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.status(204).send();
        } catch (error: any) {
            handleError(res, error)
        }
    };
}

export default new UserController();
