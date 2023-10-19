import { Request, Response } from "express";
import postCategory from "./postCategory.schema.js";

export const POST_CATEGORY_func = async (req: Request, res: Response) => {
  try {
    const { cat_name } = req.body;

    const PostCategory = new postCategory({ cat_name });

    const result = await PostCategory.save();
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const GET_CATEGORY_func = async (req: Request, res: Response) => {
  try {
    const result = await postCategory.find().populate('posts');
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const GET_CATEGORYBYID_func = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await postCategory.findById(id).populate('posts');
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const UPDATE_CATEGORY = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { cat_name } = req.body;

    const result = await postCategory.findByIdAndUpdate(
      id,
      { cat_name },
      { new: true }
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const DELETE_CATEGORY = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await postCategory.findByIdAndDelete(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
