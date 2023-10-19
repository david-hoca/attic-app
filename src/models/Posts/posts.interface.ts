import mongoose, { Schema, model, Document } from 'mongoose';

export interface IPost extends Document {
    user: mongoose.Types.ObjectId;
    comment: mongoose.Types.ObjectId[];
    createdAt: Date;
    title: string;
    img: string;
    view: number;
    likesCount: number;
    likes: mongoose.Types.ObjectId[];
    cat_id: mongoose.Types.ObjectId;
    uniqueViews: mongoose.Types.ObjectId[];
}