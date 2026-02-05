import mongoose, { Schema, model, models } from "mongoose";


export const VIDEO_DIMENSION = {
    width: 1080,
    height: 1920
} as const; 

export interface IVideo {
    _id?: mongoose.Types.ObjectId;  
    title: string;
    description?: string;   
    videoUrl: string;
    thumbnailUrl: string;
    controls?: boolean;
    transforms?: {
        height: number;
        width: number;
        fit: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';       
        quality?: number;
        format: 'mp4' | 'webm' | 'ogg';     
    };  
    duration: number; // in seconds
    dimensions: {
        width: number;
        height: number;
    };
    createdAt?: Date;
    updatedAt?: Date;
}

const videoSchema = new Schema<IVideo>(
    {
        title: { type: String, required: true },
        description: { type: String },
        videoUrl: { type: String, required: true },
        thumbnailUrl: { type: String, required: true },
        controls: { type: Boolean, default: false },
        transforms: {
            height: { type: Number, required: true },
            width: { type: Number, required: true },
            fit: { type: String, enum: ['cover', 'contain', 'fill', 'inside', 'outside'], required: true },
            quality: { type: Number, min: 1, max: 100 },
            format: { type: String, enum: ['mp4', 'webm', 'ogg'], required: true }
        },
        duration: { type: Number, required: true },
        dimensions: {
            width: { type: Number, required:true},
            height:{type:Number,required:true}
        }
    },
    {
        timestamps:true
    }
);
const Video = models?.Video || model<IVideo>("Video", videoSchema);

export default Video