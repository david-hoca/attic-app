import express from "express";
import storeContr from "./store.contr.js";
import idAndTokenChecker from "../../middleware/idAndTokenChecker.js";

const app = express.Router();
let { post, getById, getAll, put,del } = storeContr;
let { idChecker } = idAndTokenChecker;

app.post("/", post);
app.put("/:id",idChecker, put);
app.get("/", getAll);
app.get("/:id",idChecker, getById);
app.delete("/:id",idChecker, del);

export default app;
