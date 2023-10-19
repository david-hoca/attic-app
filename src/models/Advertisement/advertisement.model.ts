import mongoose, { Model, Schema } from 'mongoose';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { IAdvertisement } from './advertisement.interface';
export interface IAdvertisementModel extends Model<IAdvertisement> { }
const advertisementSchema = new Schema<IAdvertisement, IAdvertisementModel>({
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
const AdvertisementSchemaModel = mongoose.model<IAdvertisement, IAdvertisementModel>('Advertisement', advertisementSchema);

export default AdvertisementSchemaModel;
