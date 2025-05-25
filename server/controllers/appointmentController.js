const { Op } = require("sequelize");

const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Queue = require('../models/QueueModel');
const { sendEmail, emailTemplates } = require('../utils/emailServer');

// Create appointment
const createAppointment = async (req, res) => {
    try {
        const { doctorId, appointmentDate, appointmentTime, reason } = req.body;

        const doctor = await Doctor.findOne({ 
            where: { id: doctorId, isApproved: true },
            include: [{ model: User, attributes: ['name'] }]
        });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found or not approved' });
        }

        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const appointment = await Appointment.create({
            userId: req.user.id,
            doctorId,
            appointmentDate,
            appointmentTime,
            reason,
            status: 'pending'
        });

        // Send email notification
        await sendEmail(
            user.email, 
            emailTemplates.appointmentCreated(
                user.name, 
                doctor.User.name, 
                appointmentDate, 
                appointmentTime, 
                reason
            )
        );

        res.status(201).json({ message: 'Appointment created successfully', appointment });
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Approve appointment by doctor
const approveAppointment = async (req, res) => {
    const { appointmentId } = req.params;

    try {
        const appointment = await Appointment.findByPk(appointmentId, {
            include: [User, Doctor]
        });

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        appointment.status = 'approved';
        await appointment.save();

        const userEmail = appointment.User.email;
        const userName = appointment.User.name;
        const doctorName = appointment.Doctor.name;
        const date = appointment.appointmentDate;
        const time = appointment.appointmentTime;

        await sendEmail(userEmail, emailTemplates.appointmentApproved(userName, doctorName, date, time));

        res.json({ message: 'Appointment approved and email sent successfully.' });
    } catch (error) {
        console.error('Error approving appointment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Cancel appointment by doctor
const cancelAppointmentByDoctor = async (req, res) => {
    const { appointmentId } = req.params;
    const { reason } = req.body;

    try {
        const appointment = await Appointment.findByPk(appointmentId, {
            include: [User, Doctor]
        });

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        appointment.status = 'cancelled';
        await appointment.save();

        const userEmail = appointment.User.email;
        const userName = appointment.User.name;
        const doctorName = appointment.Doctor.name;
        const date = appointment.appointmentDate;
        const time = appointment.appointmentTime;

        await sendEmail(userEmail, emailTemplates.appointmentCancelled(userName, doctorName, date, time, reason));

        res.json({ message: 'Appointment cancelled and email sent successfully.' });
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Reschedule appointment
const rescheduleAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const { doctorId, appointmentDate, appointmentTime, reason } = req.body;

        const appointment = await Appointment.findOne({
            where: { id: appointmentId, userId: req.user.id, status: 'pending' },
            include: [
                {
                    model: Doctor,
                    include: [{ model: User, attributes: ['name'] }]
                }
            ]
        });

        if (!appointment) {
            return res.status(404).json({ message: 'Pending appointment not found' });
        }

        const doctor = await Doctor.findOne({
            where: { id: appointment.doctorId, isApproved: true }
        });

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found or not approved' });
        }

        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Store old values for email
        const oldDate = appointment.appointmentDate;
        const oldTime = appointment.appointmentTime;

        // Update appointment
        appointment.appointmentDate = appointmentDate;
        appointment.appointmentTime = appointmentTime;
        appointment.reason = reason;

        await appointment.save();

        // Send email notification
        await sendEmail(
            user.email,
            emailTemplates.appointmentRescheduled(
                user.name,
                appointment.Doctor.User.name,
                oldDate,
                oldTime,
                appointmentDate,
                appointmentTime,
                reason
            )
        );

        res.status(200).json({ message: 'Appointment rescheduled successfully', appointment });
    } catch (error) {
        console.error('Error rescheduling appointment:', error);
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
                    include: [{ model: User, attributes: ['name', 'email', 'phone'] }]
                }
            ],
            order: [['appointmentDate', 'ASC'], ['appointmentTime', 'ASC']]
        });

        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Fetch single appointment details
const getSingleAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;

        const appointment = await Appointment.findOne({
            where: { id: appointmentId, userId: req.user.id },
            include: [
                {
                    model: Doctor,
                    include: [{ model: User, attributes: ['name', 'email', 'phone'] }]
                }
            ]
        });

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Cancel appointment (by user)
const cancelAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;

        const appointment = await Appointment.findOne({
            where: { id: appointmentId, userId: req.user.id, status: 'pending' },
            include: [
                {
                    model: Doctor,
                    include: [{ model: User, attributes: ['name'] }]
                }
            ]
        });

        if (!appointment) {
            return res.status(404).json({ message: 'Pending appointment not found' });
        }

        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Send email notification before deleting the appointment
        await sendEmail(
            user.email,
            emailTemplates.appointmentCancelledByUser(
                user.name,
                appointment.Doctor.User.name,
                appointment.appointmentDate,
                appointment.appointmentTime
            )
        );

        await appointment.destroy();

        res.status(200).json({ message: 'Appointment cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get today's appointments
const getTodayAppointments = async (req, res) => {
    try {
        const userId = req.user.id;
        const today = new Date();

        const appointments = await Appointment.findAll({
            where: {
                userId,
                appointmentDate: today
            },
            include: [
                {
                    model: Doctor,
                    include: [{ model: User, attributes: ['name'] }]
                },
                { model: Queue, required: false }
            ],
            order: [['appointmentDate', 'ASC'], ['appointmentTime', 'ASC']]
        });

        res.status(200).json({ success: true, appointments });
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
    getTodayAppointments,
    approveAppointment,
    cancelAppointmentByDoctor
};
