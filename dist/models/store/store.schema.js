import mongoose, { model, Schema } from "mongoose";
const storeSchema = new Schema({
    storeTitle: {
        type: String,
        required: true,
    },
    storeLogo: {
        type: String,
    },
    review: [
        {
            ref: "Review",
            type: mongoose.Types.ObjectId,
        },
    ],
    posts: [
        {
            ref: "StorePosts",
            type: mongoose.Types.ObjectId,
        },
    ],
    storeImgs: [
        {
            type: String,
        },
    ],
    storeRating: {
        type: [String, Number],
    },
    phone: {
        type: String,
    },
    saveCount: {
        type: String,
    },
    location: {
        type: String,
    },
    category: {
        ref: "category",
        type: mongoose.Types.ObjectId,
    },
});
export default model("Store", storeSchema);
