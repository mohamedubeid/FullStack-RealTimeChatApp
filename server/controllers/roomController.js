const Room = require('../models/roomModel');
const roomUsers = require('../models/roomUsersModel');
const Message = require('../models/messageModel');
const mongoose = require('mongoose');

module.exports.joinRoom = async (req, res, next) => {
    try {
        const userId = req.userId;
        const userRoom = req.body.room;
        const room = { room: userRoom };
        const roomOptions = { new: true, upsert: true };
        const findOrInsertRoom = await Room.findOneAndUpdate(
            room,
            room,
            roomOptions
        );
        const roomUser = { userId, roomId: findOrInsertRoom._id };
        const options = { new: true, upsert: true };
        await roomUsers.findOneAndUpdate(roomUser, roomUser, options);
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
};

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
        console.log(to, 'this is to');

        const messages = await Message.find({
            users: {
                $all: [mongoose.Types.ObjectId(to)],
            },
        }).sort({ updatedAt: 1 });
        const roomMessages = messages.map((msg) => {
            return {
                fromSelf: msg.sender.toString() === from.toString(),
                message: msg.message.text,
            };
        });
        res.json(roomMessages);
    } catch (error) {
        next(error);
    }
};
