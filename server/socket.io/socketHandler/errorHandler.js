module.exports = function (err) {
    console.log('this is from error handler');
    if (err === 'token is not valid' || err === 'user does not auth') {
        socket.disconnect();
    }
};
