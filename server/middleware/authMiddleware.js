const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

const JWT_SECRET = 'aashishchaudhary';

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Requires admin privileges' });
    }
    next();
};

// server/middleware/authMiddleware.js
const isDoctor = async (req, res, next) => {
    try {
        if (req.user.role !== 'doctor') {
            return res.status(403).json({ message: 'Requires doctor privileges' });
        }

        // Fetch doctor details
        const doctor = await Doctor.findOne({ where: { userId: req.user.id } });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor profile not found' });
        }

        req.doctorId = doctor.id; // Add doctorId to request
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { authenticateToken, isAdmin, isDoctor };
