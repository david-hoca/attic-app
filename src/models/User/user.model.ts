import mongoose, { Model, Schema } from 'mongoose';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { IUser, UserRole } from './user.interface';
export interface IUserModel extends Model<IUser> { }
const userSchema = new Schema<IUser, IUserModel>({
    username: {
        type: String,
        required: true,
        unique: true,
        validate: [IsString, MinLength(3)],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [IsEmail],
    },
    password: {
        type: String,
        required: true,
        validate: [IsString, MinLength(8)],
    },
    role: {
        type: String,
        required: true,
        validate: [IsEnum(UserRole)],
    },
    boughtPost: [{
        type: Schema.Types.ObjectId,
        ref: 'Post',
        default: [],
    }],
    likedPost: [{
        type: Schema.Types.ObjectId,
        ref: 'Post',
        default: [],
    }],
});
const UserModel = mongoose.model<IUser, IUserModel>('User', userSchema);

export default UserModel;
