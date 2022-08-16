const checkUserMiddleware = require('./socketMiddleware/checkUser');
const {
    sendMessage,
    socketDisconnect,
    errorHandler,
    sendRoomMessage,
} = require('./socketHandler/index');

global.onlineUsers = new Map();
const onConnection = (socket) => {
    checkUserMiddleware(socket);
    onlineUsers.set(socket.userId.toString(), socket.id);

    console.log('connection', onlineUsers);

    socket.on('test', () => console.log('this is test socket.id:', socket.id));
    socket.on('send-msg', sendMessage);
    socket.on('send-room-msg', sendRoomMessage); ////////
    socket.on('disconnect', socketDisconnect);
    socket.on('error', errorHandler);
};
module.exports = onConnection;
