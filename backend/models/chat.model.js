import mongoose from "mongoose";

const chatSchema = mongoose.Schema({
    participant: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }],
    message: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
}, { timestamps: true })

export const Chat = mongoose.model('chat', chatSchema)