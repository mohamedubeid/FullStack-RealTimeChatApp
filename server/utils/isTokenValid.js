const { verifyToken } = require('./jwt');
const User = require('../models/userModel');
const mongoose = require('mongoose');

const {
    env: { SECRET_KEY },
} = process;

module.exports.isTokenValid = async (token) => {
    try {
        const user = await verifyToken(token, SECRET_KEY);

        const userId = mongoose.Types.ObjectId(user.userId.toString());
        console.log(
            '///////////////////////',
            token,
            'this is token from isTokenValid  ',
            userId,
            'this is userId from isTokenValid///////////////////////'
        );
        const checkUser = await User.countDocuments({
            _id: userId,
            isActive: true,
        });
        console.log('********************');
        if (checkUser === 0) {
            return false;
        }
        console.log(userId, 'userId from isTOken VAlid');
        return userId;
    } catch (error) {
        console.log(error);
        return false;
    }
};
