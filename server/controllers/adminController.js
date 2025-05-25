const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const { Op } = require('sequelize');

const getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'name', 'email', 'phone', 'address']
                }
            ]
        });

        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const approveDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;

        const doctor = await Doctor.findByPk(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        doctor.isApproved = true;
        await doctor.save();

        res.status(200).json({
            message: 'Doctor approved successfully',
            doctor
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            where: {
                role: {
                    [Op.ne]: 'admin'
                }
            }
        });

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'name', 'email', 'phone']
                },
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

module.exports = {
    getAllDoctors,
    approveDoctor,
    getAllUsers,
    getAllAppointments
};