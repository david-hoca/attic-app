import { Document } from "mongoose";

export interface Comment extends Document {
  comContent: string;
  createdAt: Date;
  comUser: string;
  post: mongoose.Types.ObjectId;
}
