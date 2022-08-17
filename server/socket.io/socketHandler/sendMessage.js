const Message = require('../../models/messageModel');
const mongoose = require('mongoose');

module.exports = async function (data) {
    console.log('this is from send message', onlineUsers);
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
        const sender = from;
        if (sendUserSocket) {
            console.log(
                'this is chaaaat  sender',
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
            socket
                .to(sendUserSocket + '')
                .emit('msg-receive', { message, sender });
        }
    } catch (error) {
        console.log(error, 'error');
    }
};
