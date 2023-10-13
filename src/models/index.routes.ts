import express from "express";
const router = express.Router();
import userRouter from "./User/user.routes.js";
import advertisementRouter from "./Advertisement/advertisement.routes.js";
router.use('/test', () => { });
router.use('/user', userRouter);
router.use('/user', advertisementRouter);
export default router;