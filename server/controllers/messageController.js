const Message = require('../models/messageModel');
const mongoose = require('mongoose');

module.exports.getAllMessages = async (req, res, next) => {
    try {
        const from = req.userId;
        const { to } = req.body;
        const messages = await Message.find({
            users: {
                $all: [from, mongoose.Types.ObjectId(to)],
            },
        }).sort({ updatedAt: 1 });
        const projectMessages = messages.map((msg) => {
            return {
                fromSelf: msg.sender.toString() === from.toString(),
                message: msg.message.text,
            };
        });
        res.json(projectMessages);
    } catch (error) {
        next(error);
    }
};
