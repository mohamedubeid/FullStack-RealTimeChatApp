const {
    register,
    login,
    setAvatar,
    getAllUsers,
} = require('../controllers/userController');
const { checkToken } = require('../middleware/checkToken');
const router = require('express').Router();

router.post('/register', register);
router.post('/login', login);
router.post('/setavatar', checkToken, setAvatar);
router.get('/allusers', checkToken, getAllUsers);

module.exports = router;
