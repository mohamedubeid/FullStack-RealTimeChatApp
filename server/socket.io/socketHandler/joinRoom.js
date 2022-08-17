const Message = require('../../models/messageModel');
const Room = require('../../models/roomModel');
const roomUsers = require('../../models/roomUsersModel');
const mongoose = require('mongoose');

module.exports = async function (room) {
    const socket = this;
    const userId = socket.userId;
    try {
        socket.join(room);
        const options = { new: true, upsert: true };
        const findOrInsertRoom = await Room.findOneAndUpdate(
            { room },
            { room },
            options
        );
        const userRoom = { userId, roomId: findOrInsertRoom._id };
        await roomUsers.findOneAndUpdate(userRoom, userRoom, options);
    } catch (error) {
        console.log(error, 'error');
    }
};
