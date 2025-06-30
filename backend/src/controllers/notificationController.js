const { sendPushNotification, vapidKeys } = require('../utils/push');
const cron = require('node-cron');
const PushSubscription = require('../models/PushSubscription');
const ReminderSchedule = require('../models/ReminderSchedule');

exports.subscribe = async (req, res) => {
  const subscription = req.body;
  const userId = req.user.id;

  try {
    // Upsert subscription by endpoint, and ensure userId is set
    const sub = await PushSubscription.findOneAndUpdate(
      { endpoint: subscription.endpoint },
      { ...subscription, userId },
      { upsert: true, new: true }
    );
    res.status(201).json({ message: 'Subscription registered.', id: sub._id });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save subscription', error: err.message });
  }
};

exports.scheduleReminder = async (req, res) => {
  const { title, body, time, subscription } = req.body;
  try {
    // Find or create subscription
    let sub = await PushSubscription.findOne({ endpoint: subscription.endpoint });
    if (!sub) {
      sub = await PushSubscription.create(subscription);
    }
    // Save reminder schedule
    const reminder = await ReminderSchedule.create({
      title,
      body,
      time,
      subscription: sub._id
    });
    // Remove setTimeout scheduling from here. Only save to DB
    res.status(201).json({ message: 'Reminder scheduled.', id: reminder._id });
  } catch (err) {
    res.status(500).json({ message: 'Failed to schedule reminder', error: err.message });
  }
};

exports.getVapidPublicKey = (req, res) => {
  res.json({ publicKey: vapidKeys.publicKey });
};
