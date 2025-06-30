// This file will be registered as a service worker for push notifications
self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'MedTrax Reminder';
  const options = {
    body: data.body || 'You have a scheduled reminder!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
