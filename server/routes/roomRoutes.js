const { joinRoom, getUserRooms } = require('../controllers/roomController');
const router = require('express').Router();
const { checkToken } = require('../middleware/checkToken');

router.post('/join-room', checkToken, joinRoom);
router.get('/user-rooms', checkToken, getUserRooms);

module.exports = router;
