import mongoose from "mongoose";

export interface IShopPost {
  price: number;
  title: string;
  description: string;
  img: string;
  view: number;
  likesCount: number;
  likes: mongoose.Types.ObjectId[];
  uniqueViews: mongoose.Types.ObjectId[];
}