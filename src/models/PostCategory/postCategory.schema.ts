// models/PostCategory.ts
import mongoose, { Schema } from "mongoose";    

const postCategorySchema = new Schema({
  cat_name: { type: String, required: true },
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
});

export default mongoose.model("PostCategory", postCategorySchema);

