import express from "express";
const router = express.Router();
import catRouter from "./category/cat.routes.js";
router.use('/test', () => { });
router.use("/category", catRouter);
export default router;
