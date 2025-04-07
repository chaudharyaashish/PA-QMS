const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController")
const { authenticateToken } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.get('/profile', authenticateToken, userController.getProfile);
router.put('/profile', authenticateToken, userController.updateProfile);

module.exports = router;