import { Document, Types } from "mongoose";

export interface ShopComment extends Document {
  content: string;
  userId: string;
  stars: number;
  createdAt: Date;
  shopStore: Types.ObjectId;
}
