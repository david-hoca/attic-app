import  { Document } from "mongoose";

export interface IAdvertisement extends Document {
    title: string;
    img_link: string;
    description: string;
    url: string;
}
export interface IVideoInfo extends Document {
    title: string;
    description: string;
    url: string;
}