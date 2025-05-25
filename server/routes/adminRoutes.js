
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

// Admin routes
router.get('/doctors', authenticateToken, isAdmin, adminController.getAllDoctors);
router.patch('/doctors/:doctorId/approve', authenticateToken, isAdmin, adminController.approveDoctor);
router.get('/users', authenticateToken, isAdmin, adminController.getAllUsers);
router.get('/appointments', authenticateToken, isAdmin, adminController.getAllAppointments);

module.exports = router;