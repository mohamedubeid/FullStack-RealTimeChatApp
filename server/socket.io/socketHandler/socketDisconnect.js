module.exports = async function (reason) {
    const socket = this;
    onlineUsers.delete(socket.userId.toString());
    console.log(onlineUsers, 'onlineUsers');
    console.log(reason, 'reason of disconnect');
};
