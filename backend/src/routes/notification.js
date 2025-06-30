const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

// Register push subscription (requires user to be logged in)
router.post('/subscribe', protect, notificationController.subscribe);

// Add this route to serve the VAPID public key
router.get('/vapidPublicKey', notificationController.getVapidPublicKey);

// Schedule a reminder notification
router.post('/schedule', protect, notificationController.scheduleReminder);

module.exports = router;
