// Test notification action
const testNotification = {
  type: 'SHOW_NOTIFICATION',
  payload: {
    message: 'Test message',
    messageType: 'success'
  }
};

console.log('Test notification action:', testNotification);
console.log('Payload messageType:', testNotification.payload.messageType);
console.log('Payload massageType:', testNotification.payload.massageType);
