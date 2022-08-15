const Room = require('../models/roomModel');
const roomUsers = require('../models/roomUsers');

module.exports.joinRoom = async (req, res, next) => {
    try {
        const userId = req.userId;
        const room = req.body.room;
        const checkIfRoomExist = await Room.findOne({
            room,
        });
        if (!checkIfRoomExist) {
            const room = await Room.create({
                room,
            });
        }
        console.log(checkIfRoomExist, 'checkIfExistcheckIfExist');
        await roomUsers.create({ userId });
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
};

module.exports.getUserRooms = async (req, res, next) => {
    try {
        const userId = req.userId;
        const userRooms = await Room.find({
            userId,
        });
        res.json(userRooms);
    } catch (error) {
        console.log(error);
        next(error);
    }
};
