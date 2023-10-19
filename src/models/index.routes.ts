import express from "express";
const router = express.Router();
import userRouter from "./User/user.routes.js";
import advertisementRouter from "./Advertisement/advertisement.routes.js";
import postRouter from "./Posts/posts.routes.js";
import postCategoryRouter from "./PostCategory/postCategory.routes.js";
router.use('/test', () => { });
router.use('/user', userRouter);
router.use('/postCategory', postCategoryRouter);
router.use('/advertisement', advertisementRouter); 
router.use('/post', postRouter);
export default router;