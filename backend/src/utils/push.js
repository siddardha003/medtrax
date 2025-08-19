const webpush = require('web-push');

// Use environment variables in production; fall back to existing keys for local dev
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || 'BP8FrHCgVpXEeY-op6Rj79a7GAAHhN0_P0v4BSna0R0FP6RgAwWuSXnmBya0_pSIYceCH_SGidUS9qNMQEZPNLo';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || 'Grpgxeb1kt_6citskxNGueK8-drYoV3Tx5p_zJwnooM';
const VAPID_CONTACT = process.env.VAPID_CONTACT || 'mailto:support@medtrax.com';

webpush.setVapidDetails(VAPID_CONTACT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

function sendPushNotification(subscription, dataToSend) {
  return webpush.sendNotification(subscription, JSON.stringify(dataToSend));
}

module.exports = {
  vapidKeys: {
    publicKey: VAPID_PUBLIC_KEY,
    privateKey: VAPID_PRIVATE_KEY,
  },
  sendPushNotification,
};
