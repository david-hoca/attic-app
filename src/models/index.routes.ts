import express from "express";
const router = express.Router();
import catRouter from "./category/cat.routes.js"
import userRouter from "./User/user.routes.js";
import advertisementRouter from "./Advertisement/advertisement.routes.js";
import storeRouter from "./store/store.routes.js"

router.use('/test', () => { });

router.use("/category", catRouter);
router.use("/store", storeRouter);

router.use('/user', userRouter);
router.use('/advertisement', advertisementRouter);

export default router