const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Registration = sequelize.define('Registration', {
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    eventId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Events',
            key: 'id'
        }
    }
}, {
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: false
});

module.exports = Registration; 