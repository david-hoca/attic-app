import { Request, Response } from 'express';
import PostModel from './posts.model.js';
import { uploadImg } from '../../utils/uploadImg.js';
import handleError from '../../utils/catchError.js';
import UserModel from '../User/user.model.js';
import { IPost } from './posts.interface.js';
import path from 'path';
import fs from 'fs';
class PostController {
    // Create a new post
    public createPost = async (req: Request, res: Response): Promise<void> => {
        try {
            const { title, cat_id } = req.body;
            const img = await uploadImg(req, res, title);
            const newPost = new PostModel({
                user: req.user.id,
                title,
                img,
            });

            const savedPost = await newPost.save();
            // let postCategory = await UserModel.findById(cat_id)
            // if (postCategory) {
            //     postCategory.posts.push(newPost._id)
            //     await postCategory.save();
            // }
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
                const user = await UserModel.findById(userId);
                if (user) {
                    user.viewedPosts.push(post._id);
                    await user.save();
                }
            }

            res.status(200).json(post);
        } catch (error: any) {
            handleError(res, error);
        }
    };
    // Update post by ID
    public updatePost = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params; // Postning identifikatsiyonini olish
            const userId = req.user.id;
            // Post ma'lumotlarini olish
            let post: IPost | null = await PostModel.findById(id);

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
                    let img_link: string | any = await uploadImg(req, res, title);
                    if (post) {
                        // Post ma'lumotlarini yangilash
                        post.title = title ? title : post.title;
                        post.img = img_link;
                    }
                } else {
                    // Fayl yuklanmagan holatda faqat ma'lumotlarni yangilash
                    if (post) {
                        post.title = title ? title : post.title;
                    }
                }
                // Yangilangan postni saqlash
                if (post) {
                    const updatedPost = await post.save();
                    res.status(200).json({
                        success: true,
                        data: updatedPost,
                    });
                }
            } else {
                res.status(403).json({ error: "Siz ushbu postni o'chira olmaysiz" });
            }

        } catch (error: any) {
            handleError(res, error);
        }
    };

    // Delete post by ID
    public deletePost = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params; // O'chiriladigan postning identifikatsiyonini olish
            const userId = req.user.id;
            // Post ma'lumotlarini olish
            const post = await PostModel.findById(id);

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
                await PostModel.findByIdAndDelete(id);

                res.status(204).json(); // 204-status kodi bilan ma'lumotlar yuboriladi (ma'lumotlar yo'q o'chirilgan)
            } else {
                res.status(403).json({ error: "Siz ushbu postni o'chira olmaysiz" });
            }// 204-status kodi bilan ma'lumotlar yuboriladi (ma'lumotlar yo'q o'chirilgan)
        } catch (error: any) {
            handleError(res, error);
        }
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
                post.likesCount += 1;
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
                post.likesCount -= 1;
                await post.save();
                res.status(200).json({ success: true, message: 'Post unliked' });
            }
        } catch (error: any) {
            handleError(res, error);
        }
    };
}

export default new PostController();
