const Message = require('../models/messageModel');
const mongoose = require('mongoose');

module.exports = (socket) => {
    const sendMessage = async (data) => {
        console.log(onlineUsers, 'online uses');
        const to = mongoose.Types.ObjectId(data.to);
        const from = socket.userId;
        const message = data.message;

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
                .emit('msg-receive', { message, from }); //need to add from
        }
    };
    socket.on('test', () => console.log('this is test socket.id:', socket.id));
    socket.on('send-msg', sendMessage);
};
