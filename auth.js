
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secret = process.env.JWT_SECRET

// Function to generate the JWT token
function generateToken(user) {
    return jwt.sign(user, secret, { expiresIn: '1h' });
}

// Middleware to authenticate using JWT token
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (token == null) return res.sendStatus(401, { message: 'Access denied. No token provided. '});
    try {
        req.user  = jwt.verify(token, secret);
        next();
    } catch (ex) {
        res.status(400).send({ message: 'Invalid token.' });
    }
}

module.exports = {
    generateToken,
    authenticateToken
}