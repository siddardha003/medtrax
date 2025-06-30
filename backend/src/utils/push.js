const webpush = require('web-push');

// Generate VAPID keys only once and store them securely in production
const vapidKeys = {
  publicKey: 'BP8FrHCgVpXEeY-op6Rj79a7GAAHhN0_P0v4BSna0R0FP6RgAwWuSXnmBya0_pSIYceCH_SGidUS9qNMQEZPNLo',
  privateKey: 'Grpgxeb1kt_6citskxNGueK8-drYoV3Tx5p_zJwnooM',
};

webpush.setVapidDetails(
  'mailto:siddarthakarumuri003@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

function sendPushNotification(subscription, dataToSend) {
  return webpush.sendNotification(subscription, JSON.stringify(dataToSend));
}

module.exports = {
  vapidKeys,
  sendPushNotification,
};
