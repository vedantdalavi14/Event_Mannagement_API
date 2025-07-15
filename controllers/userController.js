const { User } = require('../models');

const createUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        const newUser = await User.create({ name, email });
        res.status(201).json(newUser);
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: error.errors.map(e => e.message) });
        }
        // Log unexpected errors for better debugging.
        console.error(`An unexpected error occurred while creating user:`, error);
        res.status(500).json({ error: 'An error occurred while creating the user.' });
    }
};

module.exports = {
    createUser, 
}; 