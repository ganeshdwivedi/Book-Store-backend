// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');


const verifyToken = (req, res, next) => {

    const oldtoken = req.headers.authorization;
    const token = oldtoken.replace('Bearer ', "");

    console.log(token)
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized - Token not provided' });
    }

    try {
        const decoded = jwt.verify(token, 'book-store');
        console.log(decoded)

        next();
    } catch (error) {
        console.error('Error verifying token:', error.message);
        return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
};

module.exports = verifyToken;
