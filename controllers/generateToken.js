const jwt = require('jsonwebtoken');

const generateToken = ({ email }) => {
    return jwt.sign({ email }, "book-store", { expiresIn: '1d' })
}

module.exports = generateToken