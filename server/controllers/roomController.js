const Room = require('../models/roomModel');
const roomUsers = require('../models/roomUsersModel');
const Message = require('../models/messageModel');
const mongoose = require('mongoose');

module.exports.getUserRooms = async (req, res, next) => {
    try {
        const userId = req.userId;
        const userRooms = await roomUsers
            .find({ userId })
            .populate({ path: 'roomId', select: 'room' });
        res.json(userRooms);
    } catch (error) {
        next(error);
    }
};

module.exports.getRoomMessages = async (req, res, next) => {
    try {
        const from = req.userId;
        const { to } = req.body;
        const messages = await Message.find({
            users: {
                $all: [mongoose.Types.ObjectId(to)],
            },
        })
            .populate({ path: 'sender', select: 'username' })
            .sort({ updatedAt: 1 });
        const roomMessages = messages.map((msg) => {
            return {
                fromSelf: msg.sender._id.toString() === from.toString(),
                message: msg.message.text,
                sender: msg.sender.username,
            };
        });
        res.json(roomMessages);
    } catch (error) {
        next(error);
    }
};
