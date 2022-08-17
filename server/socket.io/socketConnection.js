const checkUserMiddleware = require('./socketMiddleware/checkUser');
const roomUsers = require('../models/roomUsersModel');
const {
    sendMessage,
    socketDisconnect,
    errorHandler,
    sendRoomMessage,
    joinRoom,
} = require('./socketHandler/index');

global.onlineUsers = new Map();
const onConnection = async (socket) => {
    checkUserMiddleware(socket);
    onlineUsers.set(socket.userId.toString(), socket.id);

    const userId = socket.userId;
    const userRooms = await roomUsers
        .find({ userId })
        .populate({ path: 'roomId', select: 'room' });
    userRooms.forEach((room) => {
        socket.join(room.roomId.room);
    });

    console.log('connection', onlineUsers);

    socket.on('send-msg', sendMessage);
    socket.on('join-room', joinRoom);
    // socket.on('send-room-msg', sendRoomMessage); ////////
    socket.on('disconnect', socketDisconnect);
    socket.on('error', errorHandler);
};
module.exports = onConnection;
