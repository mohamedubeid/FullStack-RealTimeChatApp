const { isTokenValid } = require('../../utils/isTokenValid');

module.exports = async (socket, next) => {
    const token = socket.handshake.auth.token;
    try {
        if (token) {
            const userId = await isTokenValid(token);
            if (!userId) {
                throw 'token is not valid';
            }
            socket.userId = userId;
            next();
        } else {
            throw 'user does not auth';
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
};
