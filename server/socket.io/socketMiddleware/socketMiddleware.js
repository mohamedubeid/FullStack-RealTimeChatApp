const isTokenValid = require('../../utils/isTokenValid');

module.exports = (socket) => {
    socket.use(async ([event, ...args], next) => {
        const token = socket.handshake.auth.token;
        console.log(socket.request, 'this istoken 2');
        console.log('77777777777');
        try {
            if (token) {
                const userId = await isTokenValid(token);
                if (!userId) {
                    throw 'token is not valid';
                }
                socket.userId = userId;
                next();
            } else {
                next(new Error('user not auth'));
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    });

    // socket.on('error', (err) => {
    //     if (err && err.message === 'unauthorized event') {
    //         socket.disconnect();
    //     }
    // });
};
