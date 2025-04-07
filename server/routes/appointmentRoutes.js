const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Protected routes
router.post('/', authenticateToken, appointmentController.createAppointment);
router.get('/', authenticateToken, appointmentController.getUserAppointments);
router.delete('/:appointmentId', authenticateToken, appointmentController.cancelAppointment);

module.exports = router;