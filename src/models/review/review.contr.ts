import { Request, Response } from "express";
import mongoose from "mongoose";
import { JWT } from "../../utils/jwt.js";
import Store from "../store/store.schema.js";
import Review from "./review.model.js";

export default {
  async post(req: Request, res: Response) {
    try {
      const { content, stars, storeId } = req.body;
       let token: any = req.headers.token;
        const { id:userId } = JWT.VERIFY(token) as { id: string };
      // let userId = req.user.id;
      console.log(userId);

      // Create a new Review instance
      const newReview = new Review({
        content,
        userId,
        stars,
      });

      await Store.findByIdAndUpdate(storeId, {
        $push: {
          review: newReview._id,
        },
      });

      // Save the new review to the database
      const savedReview = await newReview.save();
      reviewMid(storeId);
      res.status(201).json({ data: savedReview }); // Respond with the saved review data
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  async put(req: Request, res: Response) {
    try {
      const reviewId = req.params.id; // Get the review ID from the request parameters
      reviewMidByReviewId(reviewId);
      // Find the review by ID
      const review = await Review.findById(reviewId);

      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }

      // Extract the updated data from the request body
      const { content, stars } = req.body;

      // Update the review document with the new data
      review.content = content || review.content;
      review.stars = stars || review.stars;

      // Save the updated review to the database
      const updatedReview = await review.save();

      res.status(200).json({ data: updatedReview }); // Respond with the updated review data
    } catch (error) {
      console.error("Error updating review by ID:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  async getByStoreId(req: Request, res: Response) {
    try {
      const storeId = req.params.id; // Get the store ID from the request parameters

      // Find the store by ID
      const store = await Store.findById(storeId).populate({
        path: "review",
        populate: {
          path: "userId", // Assuming userId is the reference field
          select: ["username","email"],
        },
      });

      if (!store) {
        return res.status(404).json({ message: "Store not found" });
      }

      // Get the array of review IDs from the store document
      const reviews = store.review;
      let midStar = store.storeRating;
      let starCounts = {
        one: 0,
        two: 0,
        tree: 0,
        four: 0,
        five: 0,
      };
      reviews.forEach((e: any) => {
        if (e.stars == 1) {
          starCounts.one++;
        } else if (e.stars == 2) {
          starCounts.two++;
        } else if (e.stars == 3) {
          starCounts.tree++;
        } else if (e.stars == 4) {
          starCounts.four++;
        } else if (e.stars == 5) {
          starCounts.five++;
        }
      });


      res
        .status(200)
        .json({ stars: starCounts, rating: midStar, data: reviews }); // Respond with an array of reviews
    } catch (error) {
      console.error("Error getting reviews by store ID:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  async del(req: Request, res: Response) {
    try {
      const reviewId = req.params.id; // Get the review ID from the request parameters

      // Find the review by ID
      reviewMidByReviewId(reviewId)
      await Review.findByIdAndDelete(reviewId);
      res.status(204).json({ message: "Review deleted" }); // Respond with a 204 status (no content) on successful deletion
    } catch (error) {
      console.error("Error deleting review by ID:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

async function reviewMid(storeId: mongoose.Types.ObjectId | string) {
  let storeData: any = await Store.findById(storeId).populate("review");
  let starsArr = storeData?.review.map((e: any) => e.stars);
  let midStars =
    starsArr.reduce((a: any, b: any) => a + b, 0) / starsArr.length;
  console.log(midStars);
  storeData.storeRating = midStars.toFixed(1);
  storeData.save();
}
async function reviewMidByReviewId(reviewId: mongoose.Types.ObjectId | string) {
  let storeData: any = await Store.find({
    review: {
      $in: reviewId,
    },
  });

  if (storeData[0]) reviewMid(storeData[0]._id);
}
