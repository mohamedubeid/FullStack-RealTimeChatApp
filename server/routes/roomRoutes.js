const {
    joinRoom,
    getUserRooms,
    getRoomMessages,
} = require('../controllers/roomController');
const router = require('express').Router();
const { checkToken } = require('../middleware/checkToken');

router.post('/join-room', checkToken, joinRoom);
router.get('/user-rooms', checkToken, getUserRooms);
router.post('/room-messages', checkToken, getRoomMessages);
module.exports = router;
