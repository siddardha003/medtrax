// If you have a file like this, check the base URL configuration
import axios from 'axios';

// Make sure the base URL is correct
const API_BASE_URL = 'http://localhost:5000'; // Changed from 5003 to 5000

export const getVapidPublicKey = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/notification/vapidPublicKey`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ... other notification-related functions