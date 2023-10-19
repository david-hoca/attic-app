import { Request, Response } from 'express';
import PostModel from './posts.model.js';
import { uploadImg } from '../../utils/uploadImg.js';
import handleError from '../../utils/catchError.js';
import UserModel from '../User/user.model.js';
class PostController {
    // Create a new post
    public createPost = async (req: Request, res: Response): Promise<void> => {
        try {
            const { user, comment, title } = req.body;
            const img = await uploadImg(req, res, title);
            const newPost = new PostModel({
                user,
                comment,
                title,
                img,
            });
            const savedPost = await newPost.save();
            res.status(201).json(savedPost);
        } catch (error: any) {
            handleError(res, error);
        }
    };

    // Get all posts
    public getAllPosts = async (req: Request, res: Response): Promise<void> => {
        try {
            const posts = await PostModel.find().exec();
            res.status(200).json(posts);
        } catch (error: any) {
            handleError(res, error);
        }
    };
    // Get post by ID
    public getPostById = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        try {
            const post = await PostModel.findById(id);
            if (!post) {
                res.status(404).json({ error: 'Post not found' });
                return;
            }
            let userId = req.user.id // Assuming user ID is available in the request
            if (!post.uniqueViews.includes(userId)) {
                post.view += 1;
                post.uniqueViews.push(userId);
                await post.save();
            }

            res.status(200).json(post);
        } catch (error: any) {
            handleError(res, error);
        }
    };
    // Update post by ID
    public updatePost = async (req: Request, res: Response): Promise<void> => {
        // Implement the update logic
    };

    // Delete post by ID
    public deletePost = async (req: Request, res: Response): Promise<void> => {
        // Implement the delete logic
    };
    // Like a post
    public likePost = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const userId = req.user.id; // Assuming user ID is available in the request

            const post = await PostModel.findById(id);
            if (!post) {
                res.status(404).json({ error: 'Post not found' });
                return;
            }

            const user = await UserModel.findById(userId);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            if (!post.likes.includes(userId)) {
                post.likes.push(userId);
                await post.save();
                // Add the liked post to the user's likedPosts
                user.likedPost.push(post._id);
                await user.save();

                res.status(200).json({ success: true });
            } else {
                // Remove the liked post from the user's likedPosts
                user.likedPost = user.likedPost.filter((postId) => !postId.equals(post._id));
                await user.save();

                // Remove the user from the post's likes
                post.likes = post.likes.filter((likedUserId) => !likedUserId.equals(userId));
                await post.save();
                res.status(200).json({ success: true, message: 'Post unliked' });
            }
        } catch (error: any) {
            handleError(res, error);
        }
    };

}

export default new PostController();
