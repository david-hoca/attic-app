import { Request, Response } from "express";
import ShopCommentModel from "./shopComment.model";

// DAVID AUTHOR
export default {
  // *** POST REQUEST: Create a new shopComment ***
  async createShopComment(req: Request, res: Response) {
    try {
      const { content, userId, stars, shopStoreId } = req.body;

      const newShopComment = new ShopCommentModel({
        content,
        userId,
        stars,
        shopStore: shopStoreId, // Set the related shopStore
      });

      await newShopComment.save();
      res.status(201).json({
        data: newShopComment,
        message: "Shop comment created successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  },

  // *** PUT REQUEST: Update a shopComment ***
  async updateShopComment(req: Request, res: Response) {
    try {
      const { content, userId, stars, shopStoreId } = req.body;
      const shopCommentId = req.params.id;

      const shopComment = await ShopCommentModel.findById(shopCommentId);
      if (!shopComment) {
        return res.status(400).json({
          message: "Invalid shop comment ID.",
        });
      }

      shopComment.content = content;
      shopComment.userId = userId;
      shopComment.stars = stars;
      shopComment.shopStore = shopStoreId; // Update the related shopStore

      await shopComment.save();
      res.status(200).json({
        data: shopComment,
        message: "Shop comment updated successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  },

  // *** GET REQUEST: Retrieve all shopComments with related shopStore data ***
  async getAllShopComments(req: Request, res: Response) {
    try {
      const shopComments = await ShopCommentModel.find().populate("shopStore");

      res.json({ data: shopComments });
    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  },

  // *** GET one REQUEST: Retrieve a single shopComment ***
  async getShopComment(req: Request, res: Response) {
    try {
      const shopCommentId = req.params.id;
      const shopComment = await ShopCommentModel.findById(
        shopCommentId
      ).populate("shopStore");
      if (!shopComment) {
        return res.status(404).json({
          message: "Shop comment not found",
        });
      }
      res.json({ data: shopComment });
    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  },

  // *** DELETE REQUEST: Delete a shopComment ***
  async deleteShopComment(req: Request, res: Response) {
    try {
      const shopCommentId = req.params.id;
      const shopComment = await ShopCommentModel.findByIdAndRemove(
        shopCommentId
      );
      if (!shopComment) {
        return res.status(404).json({
          message: "Shop comment not found",
        });
      }
      res.json({ message: "Shop comment deleted." });
    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  },
};
