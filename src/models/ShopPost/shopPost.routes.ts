import { Router } from "express";
import shopPostContr from "./shopPost.contr.js";
import authMiddleware from "../../middleware/auth.js";

const router: Router = Router();

router.get("/", shopPostContr.getAllShopPosts);
router.get("/:id", shopPostContr.getShopPostById);
router.post("/", shopPostContr.createShopPost);
router.put("/:id", shopPostContr.updateShopPost);
router.delete("/:id", shopPostContr.deleteShopPost);
router.post("/like/:id", authMiddleware, shopPostContr.likePost);

export default router;
