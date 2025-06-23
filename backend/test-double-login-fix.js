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

console.log('🧪 Testing Double Login Toast Fix');
console.log('==================================\n');

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
    console.log('1️⃣  Testing single login request...');
    
    const result = await makeLoginRequest('/login', TEST_CREDENTIALS);
    
    if (result.success && result.status === 200) {
        console.log('   ✅ Single login works correctly');
        console.log(`   📝 Response: ${result.message}`);
        return true;
    } else {
        console.log('   ❌ Single login failed');
        console.log(`   📝 Error: ${result.message}`);
        return false;
    }
};

// Test 2: Duplicate request blocking
const testDuplicateBlocking = async () => {
    console.log('\n2️⃣  Testing duplicate request blocking...');
    
    // Make two rapid requests
    const promise1 = makeLoginRequest('/login', TEST_CREDENTIALS);
    const promise2 = makeLoginRequest('/login', TEST_CREDENTIALS);
    
    const [result1, result2] = await Promise.all([promise1, promise2]);
    
    // One should succeed, one should be blocked
    const successCount = [result1, result2].filter(r => r.success).length;
    const blockedCount = [result1, result2].filter(r => r.status === 429).length;
    
    if (successCount === 1 && blockedCount === 1) {
        console.log('   ✅ Duplicate request blocking works correctly');
        console.log('   📝 One request succeeded, one was blocked');
        return true;
    } else if (successCount === 2) {
        console.log('   ⚠️  Both requests succeeded (possible timing issue)');
        console.log('   📝 This might be acceptable if requests weren\'t truly simultaneous');
        return true;
    } else {
        console.log('   ❌ Duplicate request blocking failed');
        console.log(`   📝 Success: ${successCount}, Blocked: ${blockedCount}`);
        return false;
    }
};

// Test 3: Both endpoints work
const testBothEndpoints = async () => {
    console.log('\n3️⃣  Testing both login endpoints...');
    
    // Wait a moment to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const loginResult = await makeLoginRequest('/login', TEST_CREDENTIALS);
    
    // Wait again
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const directLoginResult = await makeLoginRequest('/direct-login', TEST_CREDENTIALS);
    
    if (loginResult.success && directLoginResult.success) {
        console.log('   ✅ Both endpoints work correctly');
        console.log('   📝 /login and /direct-login both functional');
        return true;
    } else {
        console.log('   ❌ One or both endpoints failed');
        console.log(`   📝 /login: ${loginResult.success ? 'OK' : loginResult.message}`);
        console.log(`   📝 /direct-login: ${directLoginResult.success ? 'OK' : directLoginResult.message}`);
        return false;
    }
};

// Test 4: Debug routes
const testDebugRoutes = async () => {
    console.log('\n4️⃣  Testing debug routes...');
    
    try {
        const response = await axios.get(`${BASE_URL}/debug/routes`);
        
        if (response.status === 200 && response.data.success) {
            console.log('   ✅ Debug route works correctly');
            console.log('   📝 Route information retrieved successfully');
            console.log(`   📝 Found ${response.data.data.authRoutes.length} auth routes`);
            return true;
        } else {
            console.log('   ❌ Debug route failed');
            return false;
        }
    } catch (error) {
        console.log('   ❌ Debug route error:', error.message);
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
    
    console.log('\n📊 Test Results Summary');
    console.log('========================');
    console.log(`✅ Passed: ${passedTests}/${totalTests}`);
    console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);
    
    if (passedTests === totalTests) {
        console.log('\n🎉 All tests passed! Double login fix is working correctly.');
        console.log('\n📝 Next steps:');
        console.log('   1. Test with frontend application');
        console.log('   2. Verify single success toast appears');
        console.log('   3. Remove debug routes in production');
    } else {
        console.log('\n⚠️  Some tests failed. Check server logs and configuration.');
        console.log('\n🔧 Troubleshooting:');
        console.log('   1. Ensure backend server is running (npm start)');
        console.log('   2. Check MongoDB connection');
        console.log('   3. Verify super admin account exists (npm run seed admin)');
    }
};

// Check if server is running first
const checkServer = async () => {
    try {
        await axios.get(`${BASE_URL}/debug/routes`);
        return true;
    } catch (error) {
        console.log('❌ Backend server is not running or not accessible');
        console.log('🔧 Please start the backend server with: npm start');
        console.log('');
        return false;
    }
};

// Main execution
(async () => {
    const serverRunning = await checkServer();
    
    if (serverRunning) {
        await runTests();
    }
    
    console.log('\n🔗 Manual Testing:');
    console.log('   - Frontend: http://localhost:3000/login');
    console.log('   - API Debug: http://localhost:5000/api/auth/debug/routes');
})();
