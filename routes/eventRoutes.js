const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { createEvent, getEventById, registerForEvent, cancelRegistration, getUpcomingEvents, getEventStats } = require('../controllers/eventController');
const { handleValidationErrors } = require('../middlewares/validation');

router.get('/upcoming', getUpcomingEvents);

router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('datetime').isISO8601().withMessage('Datetime must be in ISO 8601 format'),
    body('location').notEmpty().withMessage('Location is required'),
    body('capacity').isInt({ min: 1, max: 1000 }).withMessage('Capacity must be between 1 and 1000'),
  ],
  handleValidationErrors,
  createEvent
);

router.get(
    '/:id',
    [
        param('id').isUUID().withMessage('Event ID must be a valid UUID'),
    ],
    handleValidationErrors,
    getEventById
);

router.get(
    '/:id/stats',
    [
        param('id').isUUID().withMessage('Event ID must be a valid UUID'),
    ],
    handleValidationErrors,
    getEventStats
);

router.post(
    '/:id/register',
    [
        param('id').isUUID().withMessage('Event ID must be a valid UUID'),
        body('userId').isUUID().withMessage('User ID must be a valid UUID'),
    ],
    handleValidationErrors,
    registerForEvent
);

router.delete(
    '/:id/register',
    [
        param('id').isUUID().withMessage('Event ID must be a valid UUID'),
        body('userId').isUUID().withMessage('User ID must be a valid UUID'),
    ],
    handleValidationErrors,
    cancelRegistration
);


module.exports = router; 