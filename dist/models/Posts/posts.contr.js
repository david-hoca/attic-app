var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import PostModel from './posts.model.js';
import { uploadImg } from '../../utils/uploadImg.js';
import handleError from '../../utils/catchError.js';
class PostController {
    constructor() {
        // Create a new post
        this.createPost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { user, comment, title } = req.body;
                const img = yield uploadImg(req, res, title);
                const newPost = new PostModel({
                    user,
                    comment,
                    title,
                    img,
                });
                const savedPost = yield newPost.save();
                res.status(201).json(savedPost);
            }
            catch (error) {
                handleError(res, error);
            }
        });
        // Get all posts
        this.getAllPosts = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield PostModel.find().exec();
                res.status(200).json(posts);
            }
            catch (error) {
                handleError(res, error);
            }
        });
        // Get post by ID
        this.getPostById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const post = yield PostModel.findById(id);
                if (!post) {
                    res.status(404).json({ error: 'Post not found' });
                    return;
                }
                let userId = req.user.id; // Assuming user ID is available in the request
                if (!post.uniqueViews.includes(userId)) {
                    post.view += 1;
                    post.uniqueViews.push(userId);
                    yield post.save();
                }
                res.status(200).json(post);
            }
            catch (error) {
                handleError(res, error);
            }
        });
        // Update post by ID
        this.updatePost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // Implement the update logic
        });
        // Delete post by ID
        this.deletePost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // Implement the delete logic
        });
        this.likePost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userId = req.user.id;
                const post = yield PostModel.findById(id);
                if (!post) {
                    res.status(404).json({ error: 'Post not found' });
                    return;
                }
                if (!post.likes.includes(userId)) {
                    post.likes.push(userId);
                    yield post.save();
                }
                res.status(200).json({ success: true });
            }
            catch (error) {
                handleError(res, error);
            }
        });
    }
}
export default new PostController();
