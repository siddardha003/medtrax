// notifications.js
// Handles push subscription and scheduling reminders from the frontend
import API from './Api'; // Use the configured axios instance

const PUBLIC_VAPID_KEY_ENDPOINT = '/api/notification/vapidPublicKey';
const SUBSCRIBE_ENDPOINT = '/api/notification/subscribe';
const SCHEDULE_ENDPOINT = '/api/notification/schedule';

export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    console.log('[PushDebug] Attempting to register service worker...');
    const reg = await navigator.serviceWorker.register('/sw.js');
    console.log('[PushDebug] Service worker registered:', reg);
    return reg;
  }
  throw new Error('Service workers are not supported in this browser.');
}

export async function getVapidPublicKey() {
  console.log('[PushDebug] Fetching VAPID public key...');
  const res = await API.get(PUBLIC_VAPID_KEY_ENDPOINT);
  console.log('[PushDebug] VAPID public key response:', res.data);
  return res.data.publicKey;
}

export async function subscribeUserToPush(swRegistration, publicKey) {
  console.log('[PushDebug] Subscribing user to push with publicKey:', publicKey);
  const applicationServerKey = urlBase64ToUint8Array(publicKey);
  console.log('[PushDebug] applicationServerKey Uint8Array:', applicationServerKey);
  try {
    const subscription = await swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });
    console.log('[PushDebug] Push subscription successful:', subscription);
    // The subscription is now sent from MedReminder.jsx to ensure auth token is present
    // await API.post(SUBSCRIBE_ENDPOINT, subscription);
    return subscription;
  } catch (err) {
    console.error('[PushDebug] Push subscription failed:', err);
    throw err;
  }
}

export async function sendSubscriptionToBackend(subscription) {
  try {
    // Use the API instance which has the auth interceptor
    await API.post(SUBSCRIBE_ENDPOINT, subscription);
    console.log('[PushDebug] Subscription successfully sent to backend.');
  } catch (err) {
    console.error('[PushDebug] Failed to send subscription to backend:', err);
    throw err;
  }
}

export async function scheduleReminder({ title, body, time, subscription }) {
  await API.post(SCHEDULE_ENDPOINT, { title, body, time, subscription });
}

// Helper to convert VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
