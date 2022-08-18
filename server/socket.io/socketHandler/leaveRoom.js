const Message = require('../../models/messageModel');
const Room = require('../../models/roomModel');
const roomUsers = require('../../models/roomUsersModel');
const mongoose = require('mongoose');

module.exports = async function ({ roomId, room }) {
    const socket = this;
    const userId = socket.userId;
    try {
        socket.leave(room);
        await roomUsers.deleteOne({ userId, roomId });
        const ifAnyUserExistInRoom = await roomUsers.findOne({ roomId });
        if (!ifAnyUserExistInRoom) {
            await Room.deleteOne({ _id: roomId });
            await Message.deleteMany({
                users: [mongoose.Types.ObjectId(roomId)],
            });
        }
    } catch (error) {
        console.log(error, 'error');
    }
};
