const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');
const {authenticateToken} = require('../middleware/authMiddleware');

// Create a prescription (Doctor creates prescription for a completed appointment)
router.post('/', authenticateToken, prescriptionController.createPrescription);

// Get all prescriptions of a user
router.get('/', authenticateToken, prescriptionController.getUserPrescriptions);

// Update a prescription
router.put('/:prescriptionId', authenticateToken, prescriptionController.updatePrescription);
router.get('/doctors', authenticateToken, prescriptionController.getDoctorPrescriptions);

module.exports = router;
