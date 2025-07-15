const sequelize = require('../config/database');
const User = require('./user');
const Event = require('./event');
const Registration = require('./registration');

User.belongsToMany(Event, { through: Registration, foreignKey: 'userId' });
Event.belongsToMany(User, { through: Registration, foreignKey: 'eventId' });

const db = {
  sequelize,
  User,
  Event,
  Registration,
};

module.exports = db; 