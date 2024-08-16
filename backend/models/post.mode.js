import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    caption: { type: String, default: '' },
    image: { type: String, default: '' },
    createdby: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comment: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
}, { timestamps: true })

export const Post = mongoose.model('post', postSchema)