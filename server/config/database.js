const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('dms', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

module.exports = sequelize;