import express from "express";
import storeContr from "./store.contr.js";
const app = express.Router();
let { post, put, getAll, getOne } = storeContr;
app.post("/", post);
app.put("/:id", put);
app.get("/", getAll);
app.get("/:id", getOne);

export default app;
