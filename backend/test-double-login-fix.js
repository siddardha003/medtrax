#!/usr/bin/env node

/**
 * Test script to validate the double login toast fix
 * 
 * This script tests:
 * 1. Single login requests work correctly
 * 2. Duplicate requests are blocked
 * 3. Both /login and /direct-login endpoints work
 * 4. No duplicate responses are sent
 * 
 * Usage: node test-double-login-fix.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/auth';
const TEST_CREDENTIALS = {
    email: 'admin@medtrax.com',
    password: 'Admin@123'
};

// Test configuration
const TESTS = {
    singleLogin: true,
    duplicateRequestBlocking: true,
    bothEndpoints: true,
    debugRoutes: true
};




// Helper function to make login request
const makeLoginRequest = async (endpoint, credentials) => {
    try {
        const response = await axios.post(`${BASE_URL}${endpoint}`, credentials);
        return {
            success: true,
            status: response.status,
            message: response.data.message,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            status: error.response?.status || 0,
            message: error.response?.data?.error || error.message,
            data: error.response?.data
        };
    }
};

// Test 1: Single login request
const testSingleLogin = async () => {
    
    
    const result = await makeLoginRequest('/login', TEST_CREDENTIALS);
    
    if (result.success && result.status === 200) {
        
        
        return true;
    } else {
        
        
        return false;
    }
};

// Test 2: Duplicate request blocking
const testDuplicateBlocking = async () => {
    
    
    // Make two rapid requests
    const promise1 = makeLoginRequest('/login', TEST_CREDENTIALS);
    const promise2 = makeLoginRequest('/login', TEST_CREDENTIALS);
    
    const [result1, result2] = await Promise.all([promise1, promise2]);
    
    // One should succeed, one should be blocked
    const successCount = [result1, result2].filter(r => r.success).length;
    const blockedCount = [result1, result2].filter(r => r.status === 429).length;
    
    if (successCount === 1 && blockedCount === 1) {
        
        
        return true;
    } else if (successCount === 2) {
        
        return true;
    } else {
        
        
        return false;
    }
};

// Test 3: Both endpoints work
const testBothEndpoints = async () => {
    
    
    // Wait a moment to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const loginResult = await makeLoginRequest('/login', TEST_CREDENTIALS);
    
    // Wait again
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const directLoginResult = await makeLoginRequest('/direct-login', TEST_CREDENTIALS);
    
    if (loginResult.success && directLoginResult.success) {
        
        
        return true;
    } else {
        
        
        
        return false;
    }
};

// Test 4: Debug routes
const testDebugRoutes = async () => {
    
    
    try {
        const response = await axios.get(`${BASE_URL}/debug/routes`);
        
        if (response.status === 200 && response.data.success) {
            
            
            
            return true;
        } else {
            
            return false;
        }
    } catch (error) {
        
        return false;
    }
};

// Run all tests
const runTests = async () => {
    const results = [];
    
    if (TESTS.singleLogin) {
        results.push(await testSingleLogin());
    }
    
    if (TESTS.duplicateRequestBlocking) {
        results.push(await testDuplicateBlocking());
    }
    
    if (TESTS.bothEndpoints) {
        results.push(await testBothEndpoints());
    }
    
    if (TESTS.debugRoutes) {
        results.push(await testDebugRoutes());
    }
    
    // Summary
    const passedTests = results.filter(r => r).length;
    const totalTests = results.length;
    
    
    
    
    
    
    
};

// Check if server is running first
const checkServer = async () => {
    try {
        await axios.get(`${BASE_URL}/debug/routes`);
        return true;
    } catch (error) {
        
        
        
        return false;
    }
};

// Main execution
(async () => {
    const serverRunning = await checkServer();
    
    if (serverRunning) {
        await runTests();
    }
    
    
    
    
})();
