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
import UserModel from '../User/user.model.js';
import path from 'path';
import fs from 'fs';
import postCategorySchema from '../PostCategory/postCategory.schema.js';
class PostController {
    constructor() {
        // Create a new post
        this.createPost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { title, cat_id } = req.body;
                const img = yield uploadImg(req, res, title);
                const newPost = new PostModel({
                    user: req.user.id,
                    title,
                    img,
                    cat_id,
                });
                let postCategory = yield postCategorySchema.findById(cat_id);
                if (postCategory) {
                    postCategory.posts.push(newPost._id);
                    yield postCategory.save();
                }
                else {
                    throw Error("post category not found");
                }
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
                    const user = yield UserModel.findById(userId);
                    if (user) {
                        user.viewedPosts.push(post._id);
                        yield user.save();
                    }
                }
                res.status(200).json(post);
            }
            catch (error) {
                handleError(res, error);
            }
        });
        // Update post by ID
        this.updatePost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params; // Postning identifikatsiyonini olish
                const userId = req.user.id;
                // Post ma'lumotlarini olish
                let post = yield PostModel.findById(id);
                if (!post) {
                    res.status(404).json({ error: 'Post topilmadi' });
                    return;
                }
                // Yangi ma'lumotlarni olish
                const { title } = req.body;
                if (post.user.equals(userId)) {
                    // Yangi fayl yuklanib kelgan bo'lsa
                    if (req.files && req.files.file) {
                        // Eskiy rasimni o'chirib tashlash
                        if (post && post.img) {
                            const imgPath = path.join(process.cwd(), 'src', 'public', post.img);
                            if (fs.existsSync(imgPath)) {
                                fs.unlinkSync(imgPath);
                            }
                        }
                        // Yangi rasimni yuklash va manzilini saqlash
                        let img_link = yield uploadImg(req, res, title);
                        if (post) {
                            // Post ma'lumotlarini yangilash
                            post.title = title ? title : post.title;
                            post.img = img_link;
                        }
                    }
                    else {
                        // Fayl yuklanmagan holatda faqat ma'lumotlarni yangilash
                        if (post) {
                            post.title = title ? title : post.title;
                        }
                    }
                    // Yangilangan postni saqlash
                    if (post) {
                        const updatedPost = yield post.save();
                        res.status(200).json({
                            success: true,
                            data: updatedPost,
                        });
                    }
                }
                else {
                    res.status(403).json({ error: "Siz ushbu postni o'chira olmaysiz" });
                }
            }
            catch (error) {
                handleError(res, error);
            }
        });
        // Delete post by ID
        this.deletePost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params; // O'chiriladigan postning identifikatsiyonini olish
                const userId = req.user.id;
                // Post ma'lumotlarini olish
                const post = yield PostModel.findById(id);
                if (!post) {
                    res.status(404).json({ error: 'Post topilmadi' });
                    return;
                }
                // Rasimni o'chirish (agar rasim mavjud bo'lsa)
                // Postni yaratgan foydalanuvchi va hozirgi foydalanuvchi tekshiriladi
                if (post.user.equals(userId)) {
                    // Rasimni o'chirish (agar rasim mavjud bo'lsa)
                    if (post.img) {
                        const imgPath = path.join(process.cwd(), 'src', 'public', post.img);
                        if (fs.existsSync(imgPath)) {
                            fs.unlinkSync(imgPath);
                        }
                    }
                    // Postni o'chirish
                    yield PostModel.findByIdAndDelete(id);
                    res.status(204).json(); // 204-status kodi bilan ma'lumotlar yuboriladi (ma'lumotlar yo'q o'chirilgan)
                }
                else {
                    res.status(403).json({ error: "Siz ushbu postni o'chira olmaysiz" });
                } // 204-status kodi bilan ma'lumotlar yuboriladi (ma'lumotlar yo'q o'chirilgan)
            }
            catch (error) {
                handleError(res, error);
            }
        });
        // Like a post
        this.likePost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userId = req.user.id; // Assuming user ID is available in the request
                const post = yield PostModel.findById(id);
                if (!post) {
                    res.status(404).json({ error: 'Post not found' });
                    return;
                }
                const user = yield UserModel.findById(userId);
                if (!user) {
                    res.status(404).json({ error: 'User not found' });
                    return;
                }
                if (!post.likes.includes(userId)) {
                    post.likes.push(userId);
                    post.likesCount += 1;
                    yield post.save();
                    // Add the liked post to the user's likedPosts
                    user.likedPost.push(post._id);
                    yield user.save();
                    res.status(200).json({ success: true });
                }
                else {
                    // Remove the liked post from the user's likedPosts
                    user.likedPost = user.likedPost.filter((postId) => !postId.equals(post._id));
                    yield user.save();
                    // Remove the user from the post's likes
                    post.likes = post.likes.filter((likedUserId) => !likedUserId.equals(userId));
                    post.likesCount -= 1;
                    yield post.save();
                    res.status(200).json({ success: true, message: 'Post unliked' });
                }
            }
            catch (error) {
                handleError(res, error);
            }
        });
    }
}
export default new PostController();
