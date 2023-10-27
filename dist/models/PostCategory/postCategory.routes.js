// Import statements and Express app setup (as provided by you)
import express from "express";
import PostCategoryController from "./postCategory.contr.js";
import authMiddleware from "../../middleware/auth.js";
import { superAdminMiddleware } from "../../middleware/admins.js";
const postCategoryRouter = express.Router();
// POST CATEGORY CRUD ROUTES
//  superAdminAuthorization, middleware
postCategoryRouter
    .post("/", authMiddleware, superAdminMiddleware, PostCategoryController.POST_CATEGORY_func)
    .get("/", PostCategoryController.GET_CATEGORY_func)
    .get("/:id", PostCategoryController.GET_CATEGORYBYID_func)
    .put("/:id", authMiddleware, superAdminMiddleware, PostCategoryController.UPDATE_CATEGORY)
    .delete("/:id", authMiddleware, superAdminMiddleware, PostCategoryController.DELETE_CATEGORY);
// POSTS CRUD ROUTES (for authenticated users)
export default postCategoryRouter;
