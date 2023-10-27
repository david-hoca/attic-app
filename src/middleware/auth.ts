import { Request, Response, NextFunction } from 'express';
import { JWT } from '../utils/jwt.js'; // Import your JWT library
import UserModel from '../models/User/user.model.js';
declare global {
  namespace Express {
    interface Request {
      user: {
        role: string; 
      };
    }
  }
}
export default async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    let token: any = req.headers.token;
    if (!token) {
        return res.status(401).json({
            error: 'Token not found '
        });
    }
    try {
        const { id } = JWT.VERIFY(token) as { id: string }; // Assuming VERIFY returns an object with an 'id' property
        const user = await UserModel.findById(id);
        if (user) {
            req.user = { ...req.user, role: user.role }; // Set the user's role in req.user
            next();
        } else {
            return res.status(401).json({
                error: 'Invalid token'
            });
        }
    } catch (error) {
        return res.status(401).json({
            error: 'Invalid token'
        });
    }
}