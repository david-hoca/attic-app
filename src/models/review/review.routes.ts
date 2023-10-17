import express from "express";
import idAndTokenChecker from "../../middleware/idAndTokenChecker.js";
import reviewContr from "./review.contr.js";

const app = express.Router();
let { post, getByStoreId, put, del } = reviewContr;
let { idChecker } = idAndTokenChecker;

app.post("/", post);
app.put("/:id", idChecker, put);
app.get("/:id", idChecker, getByStoreId);
app.delete("/:id", idChecker, del);

export default app;
