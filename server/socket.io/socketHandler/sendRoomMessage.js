const Message = require('../../models/messageModel');
const mongoose = require('mongoose');

module.exports = async function (data) {
    const socket = this;
    const to = mongoose.Types.ObjectId(data.to);
    const from = socket.userId;
    const message = data.message;
    const room = data.room;
    try {
        await Message.create({
            message: { text: message },
            users: [to],
            sender: from,
        });
        console.log(
            'this is roooooom  sender',
            from,
            'sender socket id',
            socket.id,
            'receiver',
            to,
            'receiver socket id',
            'msg',
            message
        );
        const sender = data.to;
        socket.to(room).emit('msg-receive', { message, sender });
    } catch (error) {
        console.log(error, 'error');
    }
};
