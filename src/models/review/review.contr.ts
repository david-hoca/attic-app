import { Request, Response } from "express";
import Store from "../store/store.schema.js";
import Review from "./review.model.js";

export default {
  async post(req: Request, res: Response) { 
    try {
      const { content, userId, stars } = req.body;

      // Create a new Review instance
      const newReview = new Review({
        content,
        userId,
        stars,
      });

      // Save the new review to the database
      const savedReview = await newReview.save();

      res.status(201).json({ data: savedReview }); // Respond with the saved review data
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  async put(req: Request, res: Response) {
    try {
      const reviewId = req.params.id; // Get the review ID from the request parameters

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
      const store = await Store.findById(storeId);

      if (!store) {
        return res.status(404).json({ message: "Store not found" });
      }

      // Get the array of review IDs from the store document
      const reviewIds = store.review;

      // Use the review IDs to find the corresponding reviews
      const reviews = await Review.find({ _id: { $in: reviewIds } });

      res.status(200).json(reviews); // Respond with an array of reviews
    } catch (error) {
      console.error("Error getting reviews by store ID:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  async del(req: Request, res: Response) {
    try {
      const reviewId = req.params.id; // Get the review ID from the request parameters

      // Find the review by ID
      const review = await Review.findById(reviewId);

      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }

      // Delete the review
      await review.remove();

      res.status(204).json({ message: "Review deleted" }); // Respond with a 204 status (no content) on successful deletion
    } catch (error) {
      console.error("Error deleting review by ID:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
