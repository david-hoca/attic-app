import mongoose, { Schema } from "mongoose";
import { ShopComment } from "./shopCom.interface";

const ShopCommentSchema: Schema = new Schema({
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  stars: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  shopStore: {
    type: Schema.Types.ObjectId,
    ref: "ShopStore",
  },
});

const ShopCommentModel = mongoose.model<ShopComment>(
  "ShopComment",
  ShopCommentSchema
);

export default ShopCommentModel;
