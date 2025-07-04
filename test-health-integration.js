// Integration test for health tracking functionality
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Test data
const testUser = {
  name: 'Health Test User',
  email: 'healthtest@medtrax.com',
  password: 'Test123!@#',
  role: 'patient'
};

const healthData = {
  weight: {
    weight: 70.5,
    date: new Date().toISOString()
  },  hormone: {
    FSH: 85,
    LH: 65,
    testosterone: 75,
    thyroid: 88,
    prolactin: 90,
    avgBloodGlucose: 95,
    date: new Date().toISOString()
  },
  headache: {
    severity: 'mild',
    date: new Date().toISOString()
  },
  stress: {
    severity: 'severe',
    date: new Date().toISOString()
  },
  stomach: {
    severity: 'mild',
    date: new Date().toISOString()
  },
  sleep: {
    hoursSlept: 8,
    sleepQuality: 'good',
    date: new Date().toISOString()
  }
};

async function testHealthTracking() {
  let authToken = null;

  try {
    

    // Test 1: Try to access health endpoints without authentication (should fail)
    try {
      await axios.post(`${API_BASE_URL}/health/weight`, healthData.weight);
      
    } catch (error) {
      if (error.response && error.response.status === 401) {
        
      } else {
        
      }
    }    // Test 2: Login to get authentication token
    
    try {
      const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      if (loginResponse.data.success) {
        authToken = loginResponse.data.token;
        
      } else {
        
      }
    } catch (error) {
      
      // Try to register user first
      try {
        const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, testUser);
        if (registerResponse.data.success) {
                    const loginRetry = await axios.post(`${API_BASE_URL}/auth/login`, {
            email: testUser.email,
            password: testUser.password
          });
          if (loginRetry.data.success) {
            authToken = loginRetry.data.token;
            
            
          } else {
            
          }
        }      } catch (regError) {
        if (regError.response?.data?.error?.includes('already registered')) {
          
          try {
            const loginRetry = await axios.post(`${API_BASE_URL}/auth/login`, {
              email: testUser.email,
              password: testUser.password
            });            if (loginRetry.data.success) {
              authToken = loginRetry.data.token || loginRetry.data.data?.token;
              
              
            } else {
              
            }
          } catch (loginError) {
            
            return;
          }
        } else {
          
          return;
        }
      }
    }

    if (!authToken) {
      
      return;
    }

    const headers = { Authorization: `Bearer ${authToken}` };

    // Test 3: Save health data
    
    
    // Test weight tracking
    try {
      const weightResponse = await axios.post(`${API_BASE_URL}/health/weight`, healthData.weight, { headers });
      
    } catch (error) {
      
    }

    // Test hormone tracking
    try {
      const hormoneResponse = await axios.post(`${API_BASE_URL}/health/hormone`, healthData.hormone, { headers });
      
    } catch (error) {
      
    }    // Test headache tracking
    try {
      const headacheResponse = await axios.post(`${API_BASE_URL}/health/headache`, healthData.headache, { headers });
      
    } catch (error) {
      
      
    }

    // Test stress tracking
    try {
      const stressResponse = await axios.post(`${API_BASE_URL}/health/stress`, healthData.stress, { headers });
      
    } catch (error) {
      
    }

    // Test stomach tracking
    try {
      const stomachResponse = await axios.post(`${API_BASE_URL}/health/stomach`, healthData.stomach, { headers });
      
    } catch (error) {
      
    }    // Test sleep tracking
    try {
      const sleepResponse = await axios.post(`${API_BASE_URL}/health/sleep`, healthData.sleep, { headers });
      
    } catch (error) {
      
      
    }

    // Test 4: Retrieve health data
    

    // Test weight history
    try {
      const weightHistory = await axios.get(`${API_BASE_URL}/health/weight/history`, { headers });
      
    } catch (error) {
      
    }

    // Test hormone history
    try {
      const hormoneHistory = await axios.get(`${API_BASE_URL}/health/hormone/history`, { headers });
      
    } catch (error) {
      
    }

    // Test headache history
    try {
      const headacheHistory = await axios.get(`${API_BASE_URL}/health/headache/history`, { headers });
      
    } catch (error) {
      
    }

    // Test stress history
    try {
      const stressHistory = await axios.get(`${API_BASE_URL}/health/stress/history`, { headers });
      
    } catch (error) {
      
    }

    // Test stomach history
    try {
      const stomachHistory = await axios.get(`${API_BASE_URL}/health/stomach/history`, { headers });
      
    } catch (error) {
      
    }

    // Test sleep history
    try {
      const sleepHistory = await axios.get(`${API_BASE_URL}/health/sleep/history`, { headers });
      
    } catch (error) {
      
    }

    

  } catch (error) {
    
  }
}

// Run the test
testHealthTracking();
