import mongoose, { Schema } from 'mongoose';
const advertisementSchema = new Schema({
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
const AdvertisementSchemaModel = mongoose.model('Advertisement', advertisementSchema);
export default AdvertisementSchemaModel;
