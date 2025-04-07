const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

// Create appointment
const createAppointment = async (req, res) => {
    try {
        const { doctorId, appointmentDate, appointmentTime, reason } = req.body;

        // Check if doctor exists and is approved
        const doctor = await Doctor.findOne({
            where: {
                id: doctorId,
                isApproved: true
            }
        });

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found or not approved' });
        }

        // Create appointment
        const appointment = await Appointment.create({
            userId: req.user.id,
            doctorId,
            appointmentDate,
            appointmentTime,
            reason,
            status: 'pending'
        });

        res.status(201).json({
            message: 'Appointment created successfully',
            appointment
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get user appointments
const getUserAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.findAll({
            where: { userId: req.user.id },
            include: [
                {
                    model: Doctor,
                    include: [
                        {
                            model: User,
                            attributes: ['name', 'email', 'phone']
                        }
                    ]
                }
            ],
            order: [['appointmentDate', 'ASC'], ['appointmentTime', 'ASC']]
        });

        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Cancel appointment
const cancelAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;

        const appointment = await Appointment.findOne({
            where: {
                id: appointmentId,
                userId: req.user.id,
                status: 'pending'
            }
        });

        if (!appointment) {
            return res.status(404).json({ message: 'Pending appointment not found' });
        }

        // Delete appointment
        await appointment.destroy();

        res.status(200).json({
            message: 'Appointment cancelled successfully'
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createAppointment,
    getUserAppointments,
    cancelAppointment
};
