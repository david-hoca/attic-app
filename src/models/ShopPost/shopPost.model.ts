import { Schema, model } from "mongoose";
import { IShopPost } from "./shopPost.interface";

// Schema for ShopPost
const ShopPostSchema = new Schema<IShopPost>({
  price: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  view: { type: Number, default: 0 },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  uniqueViews: [{ type: Schema.Types.ObjectId, ref: "User" }],
  likesCount: {
    type: Number,
    default: 0,
  },
});

const ShopPostModel = model<IShopPost>("ShopPost", ShopPostSchema);

export default ShopPostModel;
