// server/controllers/queueController.js
const Queue = require('../models/QueueModel');
const User = require('../models/User');
const Appointment = require('../models/Appointment.js');
const {Op} = require('sequelize');

const queueController = {
    // Self check-in: Create queue entry for today's appointment
    // server/controllers/QueueManagementController.js
    async checkIn(req, res) {
        try {
            const { appointmentId } = req.body;
            const today = new Date().toISOString().split('T')[0];

            // Verify appointment exists and is for today
            const appointment = await Appointment.findOne({
                where: {
                    id: appointmentId,
                    appointmentDate: today,
                    status: 'approved'
                }
            });

            if (!appointment) {
                return res.status(404).json({
                    message: 'No valid appointment found for today'
                });
            }

            // Check if already checked in
            const existingQueue = await Queue.findOne({
                where: { appointmentId }
            });

            if (existingQueue) {
                return res.status(400).json({
                    message: 'Already checked in for this appointment'
                });
            }

            // Get the latest queue number for today
            const lastQueue = await Queue.findOne({
                where: {
                    checkInTime: {
                        [Op.gte]: new Date().setHours(0, 0, 0, 0)
                    }
                },
                order: [['queueNumber', 'DESC']]
            });

            const newQueueNumber = lastQueue ? lastQueue.queueNumber + 1 : 1;

            // Create queue entry
            const queue = await Queue.create({
                appointmentId,
                queueNumber: newQueueNumber,
                status: 'waiting'
            });

            res.status(201).json({
                message: 'Check-in successful',
                queue
            });

        } catch (error) {
            res.status(500).json({
                message: 'Error during check-in process',
                error: error.message
            });
        }
    },

    // Get current queue status for a doctor
    async getDoctorQueue(req, res) {
        try {
            const doctorId = req.doctorId; // Get from middleware
            const today = new Date().toISOString().split('T')[0];

            const queues = await Queue.findAll({
                include: [{
                    model: Appointment,
                    where: {
                        doctorId: doctorId,
                        appointmentDate: today,
                    },
                    include: [{
                        model: User,
                        attributes: ['id', 'name', 'email']
                    }]
                }],
                order: [['queueNumber', 'ASC']],
                where: {
                    status: ['waiting', 'in-progress']
                }
            });

            res.json(queues);
        } catch (error) {
            res.status(500).json({
                message: 'Error fetching queue',
                error: error.message
            });
        }
    },

    // Update queue status (for doctors)
    async updateQueueStatus(req, res) {
        try {
            const {queueId} = req.params;
            const {status} = req.body;

            const queue = await Queue.findByPk(queueId, {
                include: [Appointment]
            });

            if (!queue) {
                return res.status(404).json({message: 'Queue entry not found'});
            }

            await queue.update({
                status,
                completionTime: status === 'completed' ? new Date() : null
            });

            // If completed, update appointment status
            if (status === 'completed') {
                await queue.Appointment.update({status: 'completed'});
            }

            res.json({message: 'Queue status updated', queue});
        } catch (error) {
            res.status(500).json({
                message: 'Error updating queue status',
                error: error.message
            });
        }
    },

    // Get patient's queue position
    async getPatientQueueStatus(req, res) {
        try {
            const {appointmentId} = req.params;

            const currentQueue = await Queue.findOne({
                where: {appointmentId},
                include: [Appointment]
            });

            if (!currentQueue) {
                return res.status(404).json({message: 'Not checked in yet'});
            }

            // Count how many people are ahead in the queue
            const peopleAhead = await Queue.count({
                where: {
                    queueNumber: {[Op.lt]: currentQueue.queueNumber},
                    status: ['waiting', 'in-progress'],
                    checkInTime: {
                        [Op.gte]: new Date().setHours(0, 0, 0, 0)
                    }
                }
            });

            res.json({
                queueNumber: currentQueue.queueNumber,
                status: currentQueue.status,
                peopleAhead,
                estimatedWaitTime: peopleAhead * 15 // Assuming 15 minutes per patient
            });

        } catch (error) {
            res.status(500).json({
                message: 'Error fetching queue status',
                error: error.message
            });
        }
    }
};

module.exports = queueController;