import mongoose from "mongoose";



const reviewSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  stars: {
    type: Number,
    required: true,
    min: [1, "The minimum rating is 1 star."],
    max: [5, "The maximum rating is 5 stars."],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;
