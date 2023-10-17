import express from "express";
import idAndTokenChecker from "../../middleware/idAndTokenChecker.js";
import catContr from "./cat.contr.js";
const app = express.Router();
let { post, put, getAll, getOne, del } = catContr
let { idChecker}=idAndTokenChecker
app.post("/", post);
app.put("/:id",idChecker, put);
app.get("/", getAll);
app.get("/:id",idChecker, getOne);
app.delete("/:id",idChecker, del);

export default app;
