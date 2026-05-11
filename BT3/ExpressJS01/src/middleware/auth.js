const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = (req, res, next) => {
    try {
        const whiteList = ['/register', '/forgot-password', '/reset-password'];
        
        // Skip token check for whitelist routes
        if (whiteList.some(route => req.originalUrl.includes(route))) {
            return next();
        }

        const token = req.header('Authorization')?.split(' ')[1]; // Format: Bearer <token>

        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = auth;
