const mongoose = require('mongoose');

const ReminderScheduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  time: { type: Date, required: true },
  subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'PushSubscription', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  sent: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('ReminderSchedule', ReminderScheduleSchema);
