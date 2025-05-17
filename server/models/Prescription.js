const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");
const Doctor = require("./Doctor");
const Appointment = require("./Appointment");

const Prescription = sequelize.define("Prescription", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    appointmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Appointment,
            key: "id",
        },
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "id",
        },
    },
    doctorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Doctor,
            key: "id",
        },
    },
    prescriptionText: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

// Associations
Prescription.belongsTo(User, { foreignKey: "userId" });
Prescription.belongsTo(Doctor, { foreignKey: "doctorId" });
Prescription.belongsTo(Appointment, { foreignKey: "appointmentId" });

module.exports = Prescription;
