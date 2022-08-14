const Message = require('../../models/messageModel');
const mongoose = require('mongoose');

module.exports = async function (data) {
    console.log(onlineUsers, 'this is onlineUsers from socketListeners');
    const socket = this;
    const to = mongoose.Types.ObjectId(data.to);
    const from = socket.userId;
    const message = data.message;

    try {
        await Message.create({
            message: { text: message },
            users: [from, to],
            sender: from,
        });
        const sendUserSocket = onlineUsers.get(data.to);
        console.log(
            'sender',
            from,
            'sender socket id',
            socket.id,
            'receiver',
            to,
            'receiver socket id',
            sendUserSocket,
            'msg',
            message
        );
        if (sendUserSocket) {
            socket
                .to(sendUserSocket + '')
                .emit('msg-receive', { message, from });
        }
    } catch (error) {
        console.log(error, 'error');
    }
};
