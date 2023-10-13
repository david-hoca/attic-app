import { JWT } from "./jwt.js";
export function getUserId(req) {
    const token = req.headers.token;
    if (!token)
        throw new Error('Token not found');
    const userId = JWT.VERIFY(token).id;
    if (!userId)
        throw new Error('User not found');
    return userId;
}
