// Import the Post Controller
import express, { Router } from 'express';
import controller from './posts.contr.js';
import authMiddleware from '../../middleware/auth.js';
const postRouter: Router = express.Router();

postRouter.post('/create', authMiddleware, controller.createPost);
postRouter.get('/all', controller.getAllPosts);
postRouter.get('/:id', authMiddleware, controller.getPostById);
postRouter.put('/:id', authMiddleware, controller.updatePost);
postRouter.delete('/:id', authMiddleware, controller.deletePost);
postRouter.post('/like/:id', authMiddleware, controller.likePost);
export default postRouter;
