const { Event, User, Registration, sequelize } = require('../models');
const { Op } = require('sequelize');

const createEvent = async (req, res) => {
  try {
    const { title, datetime, location, capacity } = req.body;

    const newEvent = await Event.create({
      title,
      datetime,
      location,
      capacity,
    });

    res.status(201).json({ eventId: newEvent.id });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.errors.map(e => e.message) });
    }
    res.status(500).json({ error: 'An error occurred while creating the event.' });
  }
};

const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findByPk(id, {
            include: [{
                model: User,
                attributes: ['id', 'name', 'email'],
                through: { attributes: [] } // Don't include association table attributes
            }]
        });

        if (!event) {
            return res.status(404).json({ error: 'Event not found.' });
        }

        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving the event.' });
    }
}

const registerForEvent = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    // We use a transaction to ensure all or nothing behavior.
    // This prevents race conditions, e.g., two users registering for the last spot at the same time.
    const t = await sequelize.transaction();
    try {
        // Step 1: Find the event and lock the row for the duration of the transaction.
        const event = await Event.findByPk(id, { transaction: t });
        if (!event) {
            await t.rollback();
            return res.status(404).json({ error: 'Event not found.' });
        }
 
        // Step 2: Validate that the event is in the future.
        if (new Date(event.datetime) < new Date()) {
            await t.rollback();
            return res.status(400).json({ error: 'Cannot register for a past event.' });
        }
 
        // Step 3: Ensure the user exists.
        const user = await User.findByPk(userId, { transaction: t });
        if (!user) {
            await t.rollback();
            return res.status(404).json({ error: 'User not found.' });
        }

        // Step 4: Prevent double registration.
        const existingRegistration = await Registration.findOne({
            where: { userId, eventId: id },
            transaction: t
        });

        if (existingRegistration) {
            await t.rollback();
            return res.status(409).json({ error: 'User is already registered for this event.' });
        }

        // Step 5: Check if the event is at full capacity.
        const registrationCount = await Registration.count({ where: { eventId: id }, transaction: t });
        if (registrationCount >= event.capacity) {
            await t.rollback();
            return res.status(409).json({ error: 'Event is full.' });
        }
        
        // If all checks pass, create the registration.
        await Registration.create({ userId, eventId: id }, { transaction: t });

        // Finally, commit the transaction.
        await t.commit();
        res.status(201).json({ message: 'Successfully registered for the event.' });

    } catch (error) {
        await t.rollback();
        // Log the actual error for easier debugging on the server-side.
        console.error(`Registration failed for event ${id} and user ${userId}:`, error);
        res.status(500).json({ error: 'An error occurred while registering for the event.' });
    }
}

const cancelRegistration = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        const registration = await Registration.findOne({ where: { eventId: id, userId } });

        if (!registration) {
            return res.status(404).json({ error: 'User is not registered for this event.' });
        }

        await registration.destroy();
        res.status(200).json({ message: 'Successfully cancelled registration for the event.' });

    } catch (error) {
        res.status(500).json({ error: 'An error occurred while cancelling the registration.' });
    }
};

const getUpcomingEvents = async (req, res) => {
    try {
        const upcomingEvents = await Event.findAll({
            where: {
                datetime: {
                    [Op.gt]: new Date()
                }
            },
            order: [
                ['datetime', 'ASC'],
                ['location', 'ASC']
            ]
        });
        res.status(200).json(upcomingEvents);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching upcoming events.' });
    }
};

const getEventStats = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findByPk(id);

        if (!event) {
            return res.status(404).json({ error: 'Event not found.' });
        }

        const totalRegistrations = await Registration.count({ where: { eventId: id } });
        const remainingCapacity = event.capacity - totalRegistrations;
        const percentageUsed = (totalRegistrations / event.capacity) * 100;

        res.status(200).json({
            totalRegistrations,
            remainingCapacity,
            percentageUsed: `${percentageUsed.toFixed(2)}%`,
        });

    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching event stats.' });
    }
};

module.exports = {
  createEvent,
  getEventById,
  registerForEvent,
  cancelRegistration,
  getUpcomingEvents,
  getEventStats,
}; 