const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { createUser } = require('../controllers/userController');
const { handleValidationErrors } = require('../middlewares/validation');

router.post(
    '/',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('A valid email is required'),
    ],
    handleValidationErrors,
    createUser
);

module.exports = router; 