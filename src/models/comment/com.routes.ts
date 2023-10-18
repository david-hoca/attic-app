import express from "express";
import comController from "./com.contr.js";
const app = express.Router();

let { createComment, updateComment, getAllComments, getComment, deleteComment } =
  comController;

// ** ENDPOINTS **
app.post("/", createComment);
app.put("/:id", updateComment);
app.get("/", getAllComments);
app.get("/:id", getComment);
app.delete("/:id", deleteComment);
