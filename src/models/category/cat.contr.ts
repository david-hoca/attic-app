import { Request, Response } from "express";
import catSchema from "./cat.schema.js";

export default {
  async post(req: Request, res: Response) {
    try {
      let { catName } = req.body;
      if (!catName || !catName.toString().trim()) {
        return res.status(400).json({
          message: "Category name is required.",
        });
      }
      let newCategory = new catSchema({
        catName: catName.toString().trim(),
      });
      await newCategory.save();
      res.status(201).json({
        data: newCategory,
        message: "Category created successful",
      });
    } catch (error: any) {
      if (error.code == 11000) {
        return res.status(400).json({
          message: "Category name must be unique.",
        });
      }
      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  },
  async put(req: Request, res: Response) {
    try {
      let { catName } = req.body;
      let catId = req.params.id;

      if (!catName || !catName.toString().trim()) {
        return res.status(400).json({
          message: "No data provided for update.",
        });
      }
      await catSchema.updateOne(
        { _id: catId },
        { catName: catName.toString().trim() }
        );
        let newCategory = await catSchema.findById(catId)
            res.status(201).json({
          data: newCategory,
          message: "Category edited successful",
        });
    } catch (error: any) {
      if (error.code == 11000) {
        return res.status(400).json({
          message: "Category name must be unique.",
        });
      }
      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  },
    async getAll(req: Request, res: Response) {
      try {
          let data = await catSchema.find()
          res.json({data})
      } catch (error:any) {
         res.status(500).json({
           message: "Server error",
           error: error.message,
         });
      }
  },
    async getOne(req: Request, res: Response) {
      try {
          let data = await catSchema.findById(req.params.id)
          res.json({data})
      } catch (error:any) {
         res.status(500).json({
           message: "Server error",
           error: error.message,
         });
      }
  },
    async del(req: Request, res: Response) {
      try {
          let data = await catSchema.findByIdAndDelete(req.params.id)
          res.json({message:"Category deleted."})
      } catch (error:any) {
         res.status(500).json({
           message: "Server error",
           error: error.message,
         });
      }
  }
}; 
