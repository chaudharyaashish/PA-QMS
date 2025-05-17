const {Op} = require("sequelize");

const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Queue = require('../models/QueueModel');

// Create appointment
const createAppointment = async (req, res) => {
    try {
        const {doctorId, appointmentDate, appointmentTime, reason} = req.body;

        // Check if doctor exists and is approved
        const doctor = await Doctor.findOne({
            where: {
                id: doctorId,
                isApproved: true
            }
        });

        if (!doctor) {
            return res.status(404).json({message: 'Doctor not found or not approved'});
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
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

// Reschedule appointment
const rescheduleAppointment = async (req, res) => {
    try {
        const {appointmentId} = req.params;
        const {doctorId, appointmentDate, appointmentTime, reason} = req.body;

        // Find the appointment
        const appointment = await Appointment.findOne({
            where: {
                id: appointmentId,
                userId: req.user.id,
                status: 'pending'
            }
        });

        if (!appointment) {
            return res.status(404).json({message: 'Pending appointment not found'});
        }

        // Optionally check if the doctor is still approved
        const doctor = await Doctor.findOne({
            where: {
                id: appointment.doctorId,
                isApproved: true
            }
        });

        if (!doctor) {
            return res.status(404).json({message: 'Doctor not found or not approved'});
        }

        // Update the appointment
        appointment.appointmentDate = appointmentDate;
        appointment.appointmentTime = appointmentTime;
        appointment.reason = reason;

        await appointment.save();


        res.status(200).json({
            message: 'Appointment rescheduled successfully',
            appointment
        });
    } catch (error) {
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

// Get user appointments
const getUserAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.findAll({
            where: {userId: req.user.id},
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
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

// Fetch single appointment details
const getSingleAppointment = async (req, res) => {
    try {
        const {appointmentId} = req.params;

        // Find the appointment
        const appointment = await Appointment.findOne({
            where: {
                id: appointmentId,
                userId: req.user.id // Ensure the appointment belongs to the logged-in user
            },
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
            ]
        });

        if (!appointment) {
            return res.status(404).json({message: 'Appointment not found'});
        }

        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

// Cancel appointment
const cancelAppointment = async (req, res) => {
    try {
        const {appointmentId} = req.params;

        const appointment = await Appointment.findOne({
            where: {
                id: appointmentId,
                userId: req.user.id,
                status: 'pending'
            }
        });

        if (!appointment) {
            return res.status(404).json({message: 'Pending appointment not found'});
        }

        // Delete appointment
        await appointment.destroy();

        res.status(200).json({
            message: 'Appointment cancelled successfully'
        });
    } catch (error) {
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

// In appointmentController.js
const getTodayAppointments = async (req, res) => {
    try {
        const userId = req.user.id;
        const today = new Date();

        const appointments = await Appointment.findAll({
            where: {
                userId: userId, // changed from patientId
                appointmentDate: today,
                // status: {
                //     [Op.in]: ['approved']
                // }
            },
            include: [
                {
                    model: Doctor,
                    include: [
                        {
                            model: User,
                            attributes: ['name']
                        }
                    ]
                },
                {
                    model: Queue,
                    required: false
                }
            ],
            order: [['appointmentDate', 'ASC'], ['appointmentTime', 'ASC']]
        });

        res.status(200).json({
            success: true,
            appointments
        });
    } catch (error) {
        console.error('Error in getTodayAppointments:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching today's appointments",
            error: error.message
        });
    }
};

module.exports = {
    createAppointment,
    getUserAppointments,
    cancelAppointment,
    rescheduleAppointment,
    getSingleAppointment,
    getTodayAppointments
};
