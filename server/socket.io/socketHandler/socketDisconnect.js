module.exports = async function (reason) {
    const socket = this;
    onlineUsers.delete(socket.userId.toString());
};
