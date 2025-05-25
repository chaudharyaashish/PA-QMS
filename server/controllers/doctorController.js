const Doctor = require("../models/Doctor");
const User = require("../models/User");
const Appointment = require("../models/Appointment");
const { Op } = require("sequelize");
const { sendEmail } = require("../utils/emailServer");


const registerAsDoctor = async (req, res) => {
  try {
    const {
      specialization,
      experience,
      qualifications,
      availableDays,
      availableTimeStart,
      availableTimeEnd,
      license,
    } = req.body;

    console.log(req.body)
    const existingDoctor = await Doctor.findOne({
      where: { userId: req.user.id },
    });
    if (existingDoctor) {
      return res
        .status(400)
        .json({ message: "User is already registered as doctor" });
    }

    const doctor = await Doctor.create({
      userId: req.user.id,
      specialization,
      experience,
      qualifications,
      availableDays,
      availableTimeStart,
      availableTimeEnd,
      license,
    });

    res.status(201).json({
      message: "Doctor registration successful. Awaiting admin approval.",
      doctor,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
    console.log(error)
  }
};

const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      where: { userId: req.user.id },
      include: [
        {
          model: User,
          attributes: ["id", "name", "email", "phone", "address"],
        },
      ],
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const updateDoctorProfile = async (req, res) => {
  try {
    const {
      specialization,
      experience,
      qualifications,
      availableDays,
      availableTimeStart,
      availableTimeEnd,
    } = req.body;

    const doctor = await Doctor.findOne({ where: { userId: req.user.id } });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }
    doctor.specialization = specialization || doctor.specialization;
    doctor.experience = experience || doctor.experience;
    doctor.qualifications = qualifications || doctor.qualifications;
    doctor.availableDays = availableDays || doctor.availableDays;
    doctor.availableTimeStart = availableTimeStart || doctor.availableTimeStart;
    doctor.availableTimeEnd = availableTimeEnd || doctor.availableTimeEnd;

    await doctor.save();

    res.status(200).json({
      message: "Doctor profile updated successfully",
      doctor,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({
      where: { isApproved: true },
      include: [
        {
          model: User,
          attributes: ["id", "name", "email", "phone"],
        },
      ],
    });

    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get doctor's appointments
const getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ where: { userId: req.user.id } });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    const appointments = await Appointment.findAll({
      where: { doctorId: doctor.id },
      include: [
        {
          model: User,
          attributes: ["id", "name", "email", "phone"],
        },
      ],
      order: [
        ["appointmentDate", "ASC"],
        ["appointmentTime", "ASC"],
      ],
    });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update appointment status
const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId, status, notes } = req.body;

    const doctor = await Doctor.findOne({ where: { userId: req.user.id } });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    const appointment = await Appointment.findOne({
      where: {
        id: appointmentId,
        doctorId: doctor.id,
      },
      include:{
      }
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Update appointment
    appointment.status = status || appointment.status;
    appointment.notes = notes || appointment.notes;

    await appointment.save();

    await sendEmail()

    res.status(200).json({
      message: "Appointment status updated successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  registerAsDoctor,
  getDoctorProfile,
  updateDoctorProfile,
  getAllDoctors,
  getDoctorAppointments,
  updateAppointmentStatus,
};
