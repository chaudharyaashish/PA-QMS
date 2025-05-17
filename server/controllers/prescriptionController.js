const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

// Create a prescription
const createPrescription = async (req, res) => {
    try {
        const { appointmentId, prescriptionText } = req.body;
        console.log(req.body)
        // Find the appointment to check if it's valid
        const appointment = await Appointment.findOne({
            where: { id: appointmentId},
        });

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found or not completed' });
        }

        // Find the doctor who created the prescription
        const doctor = await Doctor.findOne({ where: { id: appointment.doctorId } });

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Create the prescription
        const prescription = await Prescription.create({
            appointmentId,
            userId: appointment.userId,
            doctorId: doctor.id,
            prescriptionText,
        });

        res.status(201).json({
            message: 'Prescription created successfully',
            prescription,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get prescriptions by user
const getUserPrescriptions = async (req, res) => {
    try {
        const prescriptions = await Prescription.findAll({
            where: { userId: req.user.id },
            include: [
                {
                    model: Doctor,
                    include: [
                        {
                            model: User,
                            attributes: ['name', 'email'],
                        },
                    ],
                },
                {
                    model: Appointment,
                    attributes: ['appointmentDate', 'appointmentTime'],
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json(prescriptions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update prescription
const updatePrescription = async (req, res) => {
    try {
        const { prescriptionId } = req.params;
        const { prescriptionText } = req.body;

        // Find the prescription
        const prescription = await Prescription.findOne({ where: { id: prescriptionId } });

        if (!prescription) {
            return res.status(404).json({ message: 'Prescription not found' });
        }

        // Update the prescription
        prescription.prescriptionText = prescriptionText;
        await prescription.save();

        res.status(200).json({
            message: 'Prescription updated successfully',
            prescription,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get prescriptions created by the doctor
const getDoctorPrescriptions = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ where: { userId: req.user.id } });

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor profile not found' });
        }

        const prescriptions = await Prescription.findAll({
            where: { doctorId: doctor.id },
            include: [
                {
                    model: User,
                    attributes: ['name', 'email'],
                },
                {
                    model: Appointment,
                    attributes: ['appointmentDate', 'appointmentTime'],
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json(prescriptions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports = {
    createPrescription,
    getUserPrescriptions,
    updatePrescription,
    getDoctorPrescriptions
};
