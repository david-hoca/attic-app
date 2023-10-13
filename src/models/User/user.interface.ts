import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    role: UserRole;
    boughtPost: mongoose.Types.ObjectId[];
    likedPost: mongoose.Types.ObjectId[];
}
export  enum UserRole {
    User = 'user',
    SuperAdmin = 'super_admin',
    ProductAdmin = 'product_admin',
}
