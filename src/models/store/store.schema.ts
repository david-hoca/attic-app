import mongoose, { model, Schema } from "mongoose";
import validator from "validator";

const storeSchema: any = new Schema({
  catName: {
    type: String,
    required: true,
    unique: true,
  },
  stores: [
    {
      ref: "Store",
      type: mongoose.Types.ObjectId,
    },
  ],
});

export default model("category", );