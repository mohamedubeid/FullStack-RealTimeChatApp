const socketListeners = require('./socketListeners');
const socketMiddleware = require('./socketMiddleware/socketMiddleware');

global.onlineUsers = new Map();
const onConnection = (socket) => {
    // socketMiddleware(socket);
    onlineUsers.set(socket.userId.toString(), socket.id);
    console.log('connection', onlineUsers);
    socketListeners(socket);
};
module.exports = onConnection;
