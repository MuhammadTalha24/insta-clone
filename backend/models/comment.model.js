import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
    createdby: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comment: { type: String, required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
}, { timestamps: true })

export const Comment = mongoose.model('comment', commentSchema)