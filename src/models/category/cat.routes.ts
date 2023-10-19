import express from "express";
import { superAdminMiddleware } from "../../middleware/admins.js";
import authMiddleware from "../../middleware/auth.js";
import idAndTokenChecker from "../../middleware/idAndTokenChecker.js";
import catContr from "./cat.contr.js";
const app = express.Router();
let { post, put, getAll, getOne, del } = catContr;
let { idChecker } = idAndTokenChecker;

app.post("/", authMiddleware, superAdminMiddleware, post);
app.put("/:id", authMiddleware, superAdminMiddleware, idChecker, put);
app.get("/", authMiddleware, getAll);
app.get("/:id", authMiddleware, idChecker, getOne);
app.delete("/:id", authMiddleware, superAdminMiddleware, idChecker, del);

export default app;
