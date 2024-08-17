//for Chatting

import { Chat } from "../models/chat.model";
import { Message } from "../models/message.model";

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const recieverId = req.params.id;

        const { message } = req.body
        let conversation = await Chat.findOne({
            participant: { $all: [senderId, recieverId] }
        })

        if (!conversation) {
            conversation = await Chat.create({
                participant: [senderId, recieverId]
            })
        }

        const newMessage = await Message.create({
            senderId,
            recieverId,
            message
        })
        if (newMessage) {
            conversation.messages.push(newMessage._id)
        }

        await Promise.all([
            await conversation.save(),
            await newMessage.save(),
        ])

        return res.status(201).json({
            newMessage,
            success: true,
        })
    } catch (error) {
        console.log(error)
    }
}