const { sign, verify } = require('jsonwebtoken');

const signToken = (payload, secret) =>
    new Promise((resolve, reject) => {
        sign(payload, secret, (err, token) => {
            if (err) {
                reject(err);
            } else resolve(token);
        });
    });

const verifyToken = (token, secret) =>
    new Promise((resolve, reject) => {
        verify(token, secret, (err, decode) => {
            if (err) {
                reject(err);
            } else resolve(decode);
        });
    });

module.exports = {
    signToken,
    verifyToken,
};
