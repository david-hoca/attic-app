import mongoose, { Document } from "mongoose";

export interface postCategory extends Document {
  cat_name: string;
  posts: mongoose.Types.ObjectId[];
}
