
const { DataTypes } = require( 'sequelize');
const  sequelize = require( '../config/database.js');
const Appointment = require( './Appointment.js');

const Queue = sequelize.define('Queue', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  appointmentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true, 
    references: {
      model: 'appointments',
      key: 'id'
    }
  },
  queueNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('waiting', 'in-progress', 'completed', 'no-show'),
    defaultValue: 'waiting',
  },
  checkInTime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  completionTime: {
    type: DataTypes.DATE,
    allowNull: true,
  }
});

Queue.belongsTo(Appointment, { foreignKey: 'appointmentId' });
Appointment.hasOne(Queue, { foreignKey: 'appointmentId' });

module.exports =  Queue;