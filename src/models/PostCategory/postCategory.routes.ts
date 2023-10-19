// Import statements and Express app setup (as provided by you)

import express from "express";
import {
  DELETE_CATEGORY,
  GET_CATEGORYBYID_func,
  GET_CATEGORY_func,
  POST_CATEGORY_func,
  UPDATE_CATEGORY,
} from "./postCategory.contr.js";
// import superAdminAuthorization from "../../middleware/superAdminAuthorization";

const postCategoryRouter = express.Router();

// POST CATEGORY CRUD ROUTES

//  superAdminAuthorization, middleware
postCategoryRouter
  .post("/", POST_CATEGORY_func)
  .get("/", GET_CATEGORY_func)
  .get("/:id", GET_CATEGORYBYID_func)
  .put("/:id", UPDATE_CATEGORY)
  .delete("/:id", DELETE_CATEGORY);

// POSTS CRUD ROUTES (for authenticated users)

export default postCategoryRouter;
