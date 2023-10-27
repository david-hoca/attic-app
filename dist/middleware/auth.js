var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { JWT } from '../utils/jwt.js'; // Import your JWT library
import UserModel from '../models/User/user.model.js';
export default function authMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let token = req.headers.token;
        if (!token) {
            return res.status(401).json({
                error: 'Token not found '
            });
        }
        try {
            const { id } = JWT.VERIFY(token); // Assuming VERIFY returns an object with an 'id' property
            const user = yield UserModel.findById(id);
            if (user) {
                req.user = Object.assign(Object.assign({}, req.user), { role: user.role }); // Set the user's role in req.user
                next();
            }
            else {
                return res.status(401).json({
                    error: 'Invalid token'
                });
            }
        }
        catch (error) {
            return res.status(401).json({
                error: 'Invalid token'
            });
        }
    });
}
