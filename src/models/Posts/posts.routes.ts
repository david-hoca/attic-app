// Import the Post Controller
import express, { Router } from 'express';
import controller from './posts.contr.js';
import authMiddleware from '../../middleware/auth.js';
import { superAdminMiddleware } from '../../middleware/admins.js';

const postRouter: Router = express.Router();

postRouter.post('/create', authMiddleware, superAdminMiddleware, controller.createPost);
postRouter.get('/all', controller.getAllPosts);
postRouter.get('/:id', controller.getPostById);
postRouter.put('/:id', authMiddleware, superAdminMiddleware, controller.updatePost);
postRouter.delete('/:id', authMiddleware, superAdminMiddleware, controller.deletePost);

// Like a post
postRouter.post('/like/:id', authMiddleware, controller.likePost);

export default postRouter;
