const { getAllMessages } = require('../controllers/messageController');
const router = require('express').Router();
const { checkToken } = require('../middleware/checkToken');

router.post('/getmsg/', checkToken, getAllMessages);
module.exports = router;
