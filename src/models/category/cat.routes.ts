import express from "express";
import catContr from "./cat.contr.js";
const app = express.Router();
let {post,put,getAll,getOne,del}=catContr
app.post("/", post);
app.put("/:id", put);
app.get("/", getAll);
app.get("/:id", getOne);
app.delete("/:id", del);

export default app;
