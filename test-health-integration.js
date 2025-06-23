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
    console.log('🧪 Starting Health Tracking Integration Test...\n');

    // Test 1: Try to access health endpoints without authentication (should fail)
    console.log('1. Testing unauthenticated access (should fail)');
    try {
      await axios.post(`${API_BASE_URL}/health/weight`, healthData.weight);
      console.log('❌ ERROR: Unauthenticated request should have failed');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Unauthenticated access properly blocked');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }    // Test 2: Login to get authentication token
    console.log('\n2. Attempting to login...');
    try {
      const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      if (loginResponse.data.success) {
        authToken = loginResponse.data.token;
        console.log(`✅ Login successful for user: ${loginResponse.data.user.name}`);
      } else {
        console.log('❌ Login failed');
      }
    } catch (error) {
      console.log('❌ Login failed - attempting to register new user...');
      // Try to register user first
      try {
        const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, testUser);
        if (registerResponse.data.success) {
          console.log('✅ Test user registered successfully');          const loginRetry = await axios.post(`${API_BASE_URL}/auth/login`, {
            email: testUser.email,
            password: testUser.password
          });
          if (loginRetry.data.success) {
            authToken = loginRetry.data.token;
            console.log('✅ Login successful after registration');
            console.log('🔑 Auth token received:', authToken ? 'Yes' : 'No');
          } else {
            console.log('❌ Login retry failed:', loginRetry.data);
          }
        }      } catch (regError) {
        if (regError.response?.data?.error?.includes('already registered')) {
          console.log('✅ Test user already exists, attempting direct login...');
          try {
            const loginRetry = await axios.post(`${API_BASE_URL}/auth/login`, {
              email: testUser.email,
              password: testUser.password
            });            if (loginRetry.data.success) {
              authToken = loginRetry.data.token || loginRetry.data.data?.token;
              console.log('✅ Login successful with existing user');
              console.log('🔍 Login response:', JSON.stringify(loginRetry.data, null, 2));
              console.log('🔑 Auth token received:', authToken ? 'Yes' : 'No');
            } else {
              console.log('❌ Login retry failed:', loginRetry.data);
            }
          } catch (loginError) {
            console.log('❌ Direct login also failed:', loginError.response?.data?.message || loginError.message);
            return;
          }
        } else {
          console.log('❌ Registration failed:', regError.response?.data?.message || regError.message);
          return;
        }
      }
    }

    if (!authToken) {
      console.log('❌ No auth token available, stopping tests');
      return;
    }

    const headers = { Authorization: `Bearer ${authToken}` };

    // Test 3: Save health data
    console.log('\n3. Testing health data saving...');
    
    // Test weight tracking
    try {
      const weightResponse = await axios.post(`${API_BASE_URL}/health/weight`, healthData.weight, { headers });
      console.log('✅ Weight data saved successfully');
    } catch (error) {
      console.log('❌ Weight save failed:', error.response?.data?.message || error.message);
    }

    // Test hormone tracking
    try {
      const hormoneResponse = await axios.post(`${API_BASE_URL}/health/hormone`, healthData.hormone, { headers });
      console.log('✅ Hormone data saved successfully');
    } catch (error) {
      console.log('❌ Hormone save failed:', error.response?.data?.message || error.message);
    }    // Test headache tracking
    try {
      const headacheResponse = await axios.post(`${API_BASE_URL}/health/headache`, healthData.headache, { headers });
      console.log('✅ Headache data saved successfully');
    } catch (error) {
      console.log('❌ Headache save failed:', error.response?.data?.message || error.message);
      console.log('❌ Headache error details:', error.response?.data);
    }

    // Test stress tracking
    try {
      const stressResponse = await axios.post(`${API_BASE_URL}/health/stress`, healthData.stress, { headers });
      console.log('✅ Stress data saved successfully');
    } catch (error) {
      console.log('❌ Stress save failed:', error.response?.data?.message || error.message);
    }

    // Test stomach tracking
    try {
      const stomachResponse = await axios.post(`${API_BASE_URL}/health/stomach`, healthData.stomach, { headers });
      console.log('✅ Stomach data saved successfully');
    } catch (error) {
      console.log('❌ Stomach save failed:', error.response?.data?.message || error.message);
    }    // Test sleep tracking
    try {
      const sleepResponse = await axios.post(`${API_BASE_URL}/health/sleep`, healthData.sleep, { headers });
      console.log('✅ Sleep data saved successfully');
    } catch (error) {
      console.log('❌ Sleep save failed:', error.response?.data?.message || error.message);
      console.log('❌ Sleep error details:', error.response?.data);
    }

    // Test 4: Retrieve health data
    console.log('\n4. Testing health data retrieval...');

    // Test weight history
    try {
      const weightHistory = await axios.get(`${API_BASE_URL}/health/weight/history`, { headers });
      console.log(`✅ Weight history retrieved: ${weightHistory.data.data.length} records`);
    } catch (error) {
      console.log('❌ Weight history retrieval failed:', error.response?.data?.message || error.message);
    }

    // Test hormone history
    try {
      const hormoneHistory = await axios.get(`${API_BASE_URL}/health/hormone/history`, { headers });
      console.log(`✅ Hormone history retrieved: ${hormoneHistory.data.data.length} records`);
    } catch (error) {
      console.log('❌ Hormone history retrieval failed:', error.response?.data?.message || error.message);
    }

    // Test headache history
    try {
      const headacheHistory = await axios.get(`${API_BASE_URL}/health/headache/history`, { headers });
      console.log(`✅ Headache history retrieved: ${headacheHistory.data.data.length} records`);
    } catch (error) {
      console.log('❌ Headache history retrieval failed:', error.response?.data?.message || error.message);
    }

    // Test stress history
    try {
      const stressHistory = await axios.get(`${API_BASE_URL}/health/stress/history`, { headers });
      console.log(`✅ Stress history retrieved: ${stressHistory.data.data.length} records`);
    } catch (error) {
      console.log('❌ Stress history retrieval failed:', error.response?.data?.message || error.message);
    }

    // Test stomach history
    try {
      const stomachHistory = await axios.get(`${API_BASE_URL}/health/stomach/history`, { headers });
      console.log(`✅ Stomach history retrieved: ${stomachHistory.data.data.length} records`);
    } catch (error) {
      console.log('❌ Stomach history retrieval failed:', error.response?.data?.message || error.message);
    }

    // Test sleep history
    try {
      const sleepHistory = await axios.get(`${API_BASE_URL}/health/sleep/history`, { headers });
      console.log(`✅ Sleep history retrieved: ${sleepHistory.data.data.length} records`);
    } catch (error) {
      console.log('❌ Sleep history retrieval failed:', error.response?.data?.message || error.message);
    }

    console.log('\n🎉 Health Tracking Integration Test Complete!');

  } catch (error) {
    console.log('❌ Test suite failed:', error.message);
  }
}

// Run the test
testHealthTracking();
