const User = require('../models/userModel');
const { hashPassword, comparePasswords } = require('../utils/b-crypt');
const { signToken } = require('../utils/jwt');

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const isUsernameExist = await User.findOne({ username });
        if (isUsernameExist) {
            return res.json({ msg: 'Username is already used', status: false });
        }
        const isEmailExist = await User.findOne({ email });
        if (isEmailExist) {
            return res.json({ msg: 'Email is already used', status: false });
        }
        const hashingPassword = await hashPassword(password);
        const user = await User.create({
            email,
            username,
            password: hashingPassword,
        });
        const token = await signToken(
            { userId: user._id },
            process.env.SECRET_KEY
        );

        res.json({
            status: true,
            user: {
                username,
                isAvatarImageSet: user.isAvatarImageSet,
                avatarImage: user.avatarImage,
            },
            token,
        });
    } catch (err) {
        next(err);
    }
};

module.exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.json({
                msg: 'Incorrect username or Password',
                status: false,
            });
        }
        const isPasswordValid = await comparePasswords(password, user.password);
        if (!isPasswordValid) {
            return res.json({
                msg: 'Incorrect username or password',
                status: false,
            });
        }

        const token = await signToken(
            { userId: user._id },
            process.env.SECRET_KEY
        );
        res.json({
            status: true,
            user: {
                username,
                isAvatarImageSet: user.isAvatarImageSet,
                avatarImage: user.avatarImage,
            },
            token,
        });
    } catch (err) {
        next(err);
    }
};

module.exports.setAvatar = async (req, res, next) => {
    try {
        const userId = req.userId;
        const avatarImage = req.body.image;
        const userData = await User.findByIdAndUpdate(
            userId,
            {
                isAvatarImageSet: true,
                avatarImage,
            },
            {
                new: true,
            }
        );
        return res.json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage,
        });
    } catch (err) {
        next(err);
    }
};

module.exports.getAllUsers = async (req, res, next) => {
    try {
        const userId = req.userId;
        const users = await User.find({ _id: { $ne: userId } }).select([
            'email',
            'username',
            'avatarImage',
            '_id',
        ]);
        res.json(users);
    } catch (err) {
        next(err);
    }
};
