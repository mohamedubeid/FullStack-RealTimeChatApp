module.exports = function (err) {
    if (err === 'token is not valid' || err === 'user does not auth') {
        socket.disconnect();
    }
};
