import mongoose, { Schema, model, Document } from 'mongoose';
import { IPost } from './posts.interface';


const postSchema = new Schema<IPost>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  comment: [
    { type: Schema.Types.ObjectId, ref: 'Comment', required: true }
  ],
  createdAt: { type: Date, default: Date.now },
  title: { type: String, required: true },
  img: String,
  view: { type: Number, default: 0 },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  uniqueViews: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  cat_id: { type: Schema.Types.ObjectId, ref: 'PostCategory' },
  likesCount: {
    type: Number,
    default: 0,
  },
});

export default model<IPost>('Post', postSchema);
