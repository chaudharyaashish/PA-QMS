const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');
const {authenticateToken} = require('../middleware/authMiddleware');

router.post('/', authenticateToken, prescriptionController.createPrescription);

router.get('/', authenticateToken, prescriptionController.getUserPrescriptions);

router.put('/:prescriptionId', authenticateToken, prescriptionController.updatePrescription);
router.get('/doctors', authenticateToken, prescriptionController.getDoctorPrescriptions);

module.exports = router;
