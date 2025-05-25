const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticateToken, isDoctor } = require('../middleware/authMiddleware');


// Protected routes
router.get('/today', authenticateToken, appointmentController.getTodayAppointments);
router.post('/', authenticateToken, appointmentController.createAppointment);
router.get('/', authenticateToken, appointmentController.getUserAppointments);
router.delete('/:appointmentId', authenticateToken, appointmentController.cancelAppointment);
router.put('/:appointmentId', authenticateToken, appointmentController.rescheduleAppointment);
router.get('/:appointmentId', authenticateToken, appointmentController.getSingleAppointment);

router.patch('/approve/:appointmentId', authenticateToken, isDoctor, appointmentController.approveAppointment);
router.delete('/cancel-by-doctor/:appointmentId', authenticateToken, isDoctor, appointmentController.cancelAppointmentByDoctor);




module.exports = router;