const mongoose = require('mongoose');

const PushSubscriptionSchema = new mongoose.Schema({
  endpoint: { type: String, required: true, unique: true },
  keys: {
    p256dh: String,
    auth: String
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Must be linked to a user
}, { timestamps: true });

PushSubscriptionSchema.index({ userId: 1 });

module.exports = mongoose.model('PushSubscription', PushSubscriptionSchema);
