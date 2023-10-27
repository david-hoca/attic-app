import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

export default {
  async idChecker(req: Request, res: Response, next: NextFunction) {
    try {
      let id = req.params.id;
      if (!mongoose.isValidObjectId(id))
        return res.status(403).json({ message: "Invalid id" });
      return next();
    } catch (error) {
      res.status(403).json({ message: "Invalid id" });
    }
  },
};
