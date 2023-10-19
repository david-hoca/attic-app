import express from "express";
import storeContr from "./store.contr.js";
import idAndTokenChecker from "../../middleware/idAndTokenChecker.js";
import { productAdminMiddleware } from "../../middleware/admins.js";
import authMiddleware from "../../middleware/auth.js";

const app = express.Router();
let { post, getById, getAll, put,del,save } = storeContr;
let { idChecker } = idAndTokenChecker;

app.post("/",authMiddleware,productAdminMiddleware, post);
app.put("/:id",authMiddleware, productAdminMiddleware, idChecker, put);
app.get("/",authMiddleware, getAll);
app.get("/:id",authMiddleware,idChecker, getById);
app.delete("/:id", authMiddleware, productAdminMiddleware, idChecker, del);

app.post("/save/:id", authMiddleware, save);

export default app;
