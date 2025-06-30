// backgroundJob.js
// Run this file with: node backgroundJob.js
const mongoose = require('mongoose');
const ReminderSchedule = require('./src/models/ReminderSchedule');
const PushSubscription = require('./src/models/PushSubscription');
const { sendPushNotification } = require('./src/utils/push');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/medtrax', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log('Background job started.');

async function processReminders() {
  const now = new Date();
  // Find reminders that are due and not sent
  const dueReminders = await ReminderSchedule.find({
    time: { $lte: now },
    sent: false
  }).populate('subscription');

  for (const reminder of dueReminders) {
    try {
      if (!reminder.subscription) {
        console.error(`Reminder ${reminder._id} has no subscription. Marking as sent to avoid retries.`);
        await ReminderSchedule.findByIdAndUpdate(reminder._id, { sent: true });
        continue;
      }
      
      await sendPushNotification(reminder.subscription, {
        title: 'Medtrax Medical Reminder',
        body: `Time to take your medicine - ${reminder.title}.`,
        icon: '/images/Medtrax-logo.png',
      });
      // Mark the schedule as sent instead of deleting
      await ReminderSchedule.findByIdAndUpdate(reminder._id, { sent: true });
      console.log(`Sent and marked reminder: ${reminder.title} to ${reminder.subscription.endpoint}`);
    } catch (err) {
      // If sending fails, we might want to retry later, so we don't delete it.
      // For now, we'll just log the error. A more robust system could add a retry count.
      console.error('Failed to send reminder (will retry next cycle):', err);
    }
  }
}

// New function to mark old reminders as completed
async function processCompletedReminders() {
  const now = new Date();
  try {
    const result = await require('./src/models/MedicalReminder').MedicineReminder.updateMany(
      { endDate: { $lt: now }, status: 'active' },
      { $set: { status: 'completed' } }
    );
    if (result.modifiedCount > 0) {
      console.log(`Marked ${result.modifiedCount} reminders as completed.`);
    }
  } catch (err) {
    console.error('Error processing completed reminders:', err);
  }
}

// Run reminder processing every minute
setInterval(processReminders, 60 * 1000);
// Run completed reminders check once every 24 hours
setInterval(processCompletedReminders, 24 * 60 * 60 * 1000);

// Optionally, run once at startup
processReminders();
processCompletedReminders();
