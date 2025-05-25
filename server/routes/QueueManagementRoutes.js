
const express = require('express');
const queueController = require('../controllers/QueueManagementController.js');
const {authenticateToken, isDoctor} = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/status/:appointmentId', authenticateToken, queueController.getPatientQueueStatus);
router.get('/doctor/queue', [authenticateToken, isDoctor], queueController.getDoctorQueue);
router.post('/check-in', authenticateToken, queueController.checkIn);
router.patch('/:queueId/status', authenticateToken, queueController.updateQueueStatus);

module.exports = router;