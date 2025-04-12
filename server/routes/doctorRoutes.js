const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { authenticateToken, isDoctor } = require('../middleware/authMiddleware');

// Public routes
router.get('/', doctorController.getAllDoctors);

// User routes
router.post('/register', authenticateToken, doctorController.registerAsDoctor);

// Doctor routes
router.get('/profile', authenticateToken, isDoctor, doctorController.getDoctorProfile);
router.put('/profile', authenticateToken, isDoctor, doctorController.updateDoctorProfile);
router.get('/appointments', authenticateToken, isDoctor, doctorController.getDoctorAppointments);
router.put('/appointments', authenticateToken, isDoctor, doctorController.updateAppointmentStatus);
router.get('/me', authenticateToken, isDoctor, doctorController.getDoctorProfile)
module.exports = router;