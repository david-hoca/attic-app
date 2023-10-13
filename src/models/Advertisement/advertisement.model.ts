import mongoose, { Model, Schema } from 'mongoose';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { IAdvertisement } from './advertisement.interface';
export interface IAdvertisementModel extends Model<IAdvertisement> { }
const userSchema = new Schema<IAdvertisement, IAdvertisementModel>({
    title: {
        type: String,
        required: true,
    },
    img_link: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },

});
const UserModel = mongoose.model<IAdvertisement, IAdvertisementModel>('User', userSchema);

export default UserModel;
