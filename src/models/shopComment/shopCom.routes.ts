import express from "express";
import shopCommentController from "./shopCom.contr";

const app = express.Router();

const {
  createShopComment,
  updateShopComment,
  getAllShopComments,
  getShopComment,
  deleteShopComment,
} = shopCommentController;

// ** ENDPOINTS **
app.post("/", createShopComment);
app.put("/:id", updateShopComment);
app.get("/", getAllShopComments);
app.get("/:id", getShopComment);
app.delete("/:id", deleteShopComment);

export default app;
