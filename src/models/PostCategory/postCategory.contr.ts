import { Request, Response } from "express";
import postCategory from "./postCategory.schema.js";
class PostCategoryController {
  public POST_CATEGORY_func = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { cat_name } = req.body;

      const PostCategory = new postCategory({ cat_name });

      const result = await PostCategory.save();
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  public GET_CATEGORY_func = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const result = await postCategory.find();
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  public GET_CATEGORYBYID_func = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = req.params.id;
      const result = await postCategory.findById(id);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  public UPDATE_CATEGORY = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = req.params.id;
      const { cat_name } = req.body;

      const result = await postCategory.findByIdAndUpdate(
        id,
        { cat_name },
        { new: true }
      );
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  public DELETE_CATEGORY = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;

      const result = await postCategory.findByIdAndDelete(id);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: (error as Error).message });
    }
  };
}

export default new PostCategoryController();
