import express from "express";
import authMiddleware from "../../middleware/auth.js";
import idAndTokenChecker from "../../middleware/idAndTokenChecker.js";
import reviewContr from "./review.contr.js";

const app = express.Router();
let { post, getByStoreId, put, del } = reviewContr;
let { idChecker } = idAndTokenChecker;

app.post("/", authMiddleware, post);
app.put("/:id", authMiddleware, idChecker, put);
app.get("/:id", authMiddleware, idChecker, getByStoreId);
app.delete("/:id", authMiddleware, idChecker, del);

export default app;
