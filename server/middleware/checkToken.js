const { isTokenValid } = require('../utils/isTokenValid');
const checkToken = async (req, res, next) => {
    if (
        !req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer') ||
        !req.headers.authorization.split(' ')[1]
    ) {
        return res.status(401).send({
            msg: 'Please provide the token',
        });
    }

    try {
        const token = req.headers.authorization.split(' ')[1];
        const userId = await isTokenValid(token + '');
        if (!userId) {
            throw 'error';
        }
        req.userId = userId;
        next();
    } catch (err) {
        console.log(err);
        return res.status(403).json({ message: 'Invalid Token' });
    }
};

module.exports = { checkToken };
