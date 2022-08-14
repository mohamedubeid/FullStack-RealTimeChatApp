const User = require('../../models/userModel');
module.exports = (socket) => {
    socket.use(async ([event, ...args], next) => {
        try {
            console.log('this is checkUSer middleware0000000000000');
            const userId = socket.userId;
            const checkUser = await User.countDocuments({
                _id: userId,
                isActive: true,
            });
            if (checkUser === 0) {
                throw 'user does not exist';
            }
            next();
        } catch (error) {
            console.log(error);
            next(error);
        }
    });

    socket.on('error', (err) => {
        if (err === 'user does not exist') {
            socket.disconnect();
        }
    });
};
