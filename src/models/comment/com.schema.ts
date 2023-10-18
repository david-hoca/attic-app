// comment.model.ts

import mongoose, { Schema } from "mongoose";
import { Comment } from "./com.interface";

const CommentSchema: Schema = new Schema({
  comContent: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  comUser: {
    type: String,
    required: false,
  },
  post: {
    type: mongoose.Types.ObjectId,
    ref: "Post",
  },
});

const CommentModel = mongoose.model<Comment>("Comment", CommentSchema);

export default CommentModel;
