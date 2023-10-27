import mongoose, { model, Schema } from "mongoose";
const catSchema = new Schema({
    catName: {
        type: String,
        required: true,
        unique: true,
    },
    stores: [{
            ref: "Store",
            type: mongoose.Types.ObjectId,
        }]
});
export default model("category", catSchema);
