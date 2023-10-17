import express from "express";
const router = express.Router();
import catRouter from "./category/cat.routes.js";
import storeRouter from "./store/store.routes.js";
router.use('/test', () => { });
router.use("/category", catRouter);
router.use("/store", storeRouter);
export default router;
