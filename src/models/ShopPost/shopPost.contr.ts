import { Request, Response } from "express";
import { IShopPost } from "./shopPost.interface";
import ShopPostModel from "./shopPost.model.js";
import { uploadImg } from "../../utils/uploadImg.js";
import fs from "fs";
import path from "path";
import handleError from "../../utils/catchError.js";
import UserModel from "../User/user.model";

class ShopPostController {
  // Create a new shop post
  async createShopPost(req: Request, res: Response) {
    try {
      const { price, title, description }: IShopPost = req.body;
      if (!price || !title || !description) {
        res.status(400).json({ error: "Fields are required" });
      }

      let img = await uploadImg(req, res, title);

      const newShopPost = await ShopPostModel.create({
        price,
        title,
        description,
        img,
      });
      return res.status(201).json(newShopPost);
    } catch (error: any) {
      handleError(res, error);
    }
  }

  // Get all shop posts
  async getAllShopPosts(req: Request, res: Response) {
    try {
      const shopPost = await ShopPostModel.find();

      return res.status(200).json(shopPost);
    } catch (error: any) {
      handleError(res, error);
    }
  }

  // Get shop posts by id
  async getShopPostById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const shopPost = await ShopPostModel.findById(id);
      if (!shopPost) {
        return res
          .status(404)
          .json({ message: "Shop post not found", status: 404 });
      }

      let userId = req.user.id; // Assuming user ID is available in the request
      if (!shopPost.uniqueViews.includes(userId)) {
        shopPost.view += 1;
        shopPost.uniqueViews.push(userId);
        await shopPost.save();
        const user = await UserModel.findById(userId);
        if (user) {
          user.viewedPosts.push(shopPost._id);
          await user.save();
        }
      }
      return res.status(200).json(shopPost);
    } catch (error: any) {
      handleError(res, error);
    }
  }

  // Edit shop post
  async updateShopPost(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { price, title, description }: IShopPost = req.body;
      let shopPost: IShopPost | null = await ShopPostModel.findById(id);

      if (!shopPost) {
        res.status(404).json({ error: "Shop post not found" });
      }

      // Yangi fayl yuklanib kelgan bo'lsa
      if (req.files && req.files.file) {
        // Eskiy rasimni o'chirib tashlash
        if (shopPost && shopPost.img) {
          const imgPath = path.join(
            process.cwd(),
            "src",
            "public",
            shopPost.img
          );
          if (fs.existsSync(imgPath)) {
            fs.unlinkSync(imgPath);
          }
        }

        // Yangi rasimni yuklash va manzilini saqlash
        let img_link: string | any = await uploadImg(req, res, title);
        if (shopPost) {
          // Reklama ma'lumotlarini yangilash
          shopPost.price = price ? price : shopPost.price;
          shopPost.title = title ? title : shopPost.title;
          shopPost.description = description
            ? description
            : shopPost.description;
          shopPost.img = img_link;
        }
      } else {
        // Fayl yuklanmagan holatda faqat ma'lumotlarni yangilash
        if (shopPost) {
          shopPost.price = price ? price : shopPost.price;
          shopPost.title = title ? title : shopPost.title;
          shopPost.description = description
            ? description
            : shopPost.description;
        }
      }

      if (shopPost) {
        const updatedShopPost = await ShopPostModel.findByIdAndUpdate(
          id,
          shopPost,
          { new: true }
        );

        res.status(200).json({
          success: true,
          data: updatedShopPost,
        });
      }
    } catch (error: any) {
      handleError(res, error);
    }
  }

  // Delete a shop post
  async deleteShopPost(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const shopPost = await ShopPostModel.findById(id);
      if (!shopPost) {
        res.status(404).json({ error: "Shop post not found" });
      } else {
        const imgPath = path.join(process.cwd(), "src", "public", shopPost.img);
        if (fs.existsSync(imgPath)) {
          fs.unlinkSync(imgPath);
        }
      }

      await ShopPostModel.findByIdAndDelete(id);

      res.status(204).json({ message: "Deleted successfully" });
    } catch (error: any) {
      handleError(res, error);
    }
  }

  async likePost(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user.id; // Assuming user ID is available in the request
      const shopPost = await ShopPostModel.findById(id);
      if (!shopPost) {
        res.status(404).json({ error: "Shop post not found" });
        return;
      }
      const user = await UserModel.findById(userId);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      if (!shopPost.likes.includes(userId)) {
        shopPost.likes.push(userId);
        shopPost.likesCount += 1;
        await shopPost.save();
        // Add the liked post to the user's likedPosts
        user.likedPost.push(shopPost._id);
        await user.save();

        res.status(200).json({ success: true });
      } else {
        // Remove the liked post from the user's likedPosts
        user.likedPost = user.likedPost.filter(
          (postId) => !postId.equals(shopPost._id)
        );
        await user.save();
        // Remove the user from the post's likes
        shopPost.likes = shopPost.likes.filter(
          (likedUserId) => !likedUserId.equals(userId)
        );
        shopPost.likesCount -= 1;
        await shopPost.save();
        res.status(200).json({ success: true, message: "Post unliked" });
      }
    } catch (error: any) {
      handleError(res, error);
    }
  }
}

export default new ShopPostController();
