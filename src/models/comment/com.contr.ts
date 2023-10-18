import { Request, Response } from "express";
import CommentModel from "./com.schema";
import PostModel from "./post.model";

// DAVID AUTHOR
export default {
  // *** POST REQUEST: Create a new comment and associate it with a post ***
  async createComment(req: Request, res: Response) {
    try {
      const { comContent, comUser, postId } = req.body;

      const post = await PostModel.findById(postId);
      if (!post) {
        return res.status(400).json({
          message: "Invalid post ID.",
        });
      }

      const newComment = new CommentModel({
        comContent,
        comUser,
        post: post._id,
      });

      await newComment.save();
      res.status(201).json({
        data: newComment,
        message: "Comment created successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  },

  // *** PUT REQUEST: Update a comment ***
  async updateComment(req: Request, res: Response) {
    try {
      const { comContent, comUser, postId } = req.body;
      const commentId = req.params.id;

      const comment = await CommentModel.findById(commentId);
      if (!comment) {
        return res.status(400).json({
          message: "Invalid comment ID.",
        });
      }

      const post = await PostModel.findById(postId);
      if (!post) {
        return res.status(400).json({
          message: "Invalid post ID.",
        });
      }

      comment.comContent = comContent;
      comment.comUser = comUser;
      comment.post = post._id;

      await comment.save();
      res.status(200).json({
        data: comment,
        message: "Comment updated successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  },

  // *** GET REQUEST: Retrieve all comments with post relations ***
  async getAllComments(req: Request, res: Response) {
    try {
      const comments = await CommentModel.find().populate("post");
      res.json({ data: comments });
    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  },

  // *** GET one REQUEST: Retrieve a single comment with post relation ***
  async getComment(req: Request, res: Response) {
    try {
      const commentId = req.params.id;
      const comment = await CommentModel.findById(commentId).populate("post");
      if (!comment) {
        return res.status(404).json({
          message: "Comment not found",
        });
      }
      res.json({ data: comment });
    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  },

  // *** DELETE REQUEST: Delete a comment ***
  async deleteComment(req: Request, res: Response) {
    try {
      const commentId = req.params.id;
      const comment = await CommentModel.findByIdAndRemove(commentId);
      if (!comment) {
        return res.status(404).json({
          message: "Comment not found",
        });
      }
      res.json({ message: "Comment deleted." });
    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  },
};
