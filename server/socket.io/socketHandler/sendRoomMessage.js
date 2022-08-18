const Message = require('../../models/messageModel');
const mongoose = require('mongoose');

module.exports = async function (data) {
    const socket = this;
    const to = mongoose.Types.ObjectId(data.to);
    const from = socket.userId;
    const message = data.message;
    const room = data.room;
    const senderUsername = data.sender;
    try {
        await Message.create({
            message: { text: message },
            users: [to],
            sender: from,
        });
        const sender = data.to;
        socket
            .to(room)
            .emit('msg-receive', { message, sender, senderUsername });
    } catch (error) {
        console.log(error, 'error');
    }
};
