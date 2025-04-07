const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Doctor = sequelize.define("Doctor", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  specialization: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  experience: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  qualifications: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  availableDays: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  availableTimeStart: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  availableTimeEnd: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  license: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Doctor.belongsTo(User, { foreignKey: "userId" });

module.exports = Doctor;
