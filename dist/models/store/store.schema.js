import mongoose, { model, Schema } from "mongoose";
const storeSchema = new Schema({
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
export default model("category");
