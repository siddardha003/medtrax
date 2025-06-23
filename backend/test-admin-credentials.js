#!/usr/bin/env node

/**
 * Test script to debug admin-created credential issues
 * 
 * This script tests:
 * 1. Super admin login (should work)
 * 2. Hospital admin login from seeder (should work)
 * 3. Shop admin login from seeder (should work)
 * 4. Debug admin-created credentials
 * 
 * Usage: node test-admin-credentials.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/auth';

// Test accounts from seeder
const TEST_ACCOUNTS = {
    superAdmin: {
        email: 'admin@medtrax.com',
        password: 'Admin@123'
    },
    hospitalAdmin1: {
        email: 'hospital1@medtrax.com',
        password: 'Hospital@123'
    },
    hospitalAdmin2: {
        email: 'hospital2@medtrax.com',
        password: 'Hospital@123'
    },
    shopAdmin1: {
        email: 'shop1@medtrax.com',
        password: 'Shop@123'
    },
    shopAdmin2: {
        email: 'shop2@medtrax.com',
        password: 'Shop@123'
    }
};

console.log('🧪 Testing Admin-Created Credentials');
console.log('====================================\n');

// Helper function to make login request
const makeLoginRequest = async (endpoint, credentials) => {
    try {
        const response = await axios.post(`${BASE_URL}${endpoint}`, credentials);
        return {
            success: true,
            status: response.status,
            message: response.data.message,
            data: response.data,
            user: response.data.data?.user
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

// Helper function to test credentials via debug endpoint
const testCredentials = async (credentials) => {
    try {
        const response = await axios.post(`${BASE_URL}/debug/test-credentials`, credentials);
        return {
            success: true,
            data: response.data.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.error || error.message,
            data: error.response?.data
        };
    }
};

// Test specific account
const testAccount = async (name, credentials) => {
    console.log(`\n🔍 Testing ${name}:`);
    console.log(`   Email: ${credentials.email}`);
    console.log(`   Password: ${credentials.password}`);
    
    // First, use debug endpoint to check credentials
    console.log('   📊 Running credential analysis...');
    const debugResult = await testCredentials(credentials);
    
    if (debugResult.success) {
        const debug = debugResult.data;
        console.log(`   👤 User found: ${debug.userFound ? 'YES' : 'NO'}`);
        console.log(`   🆔 User ID: ${debug.userId || 'N/A'}`);
        console.log(`   🎭 Role: ${debug.role || 'N/A'}`);
        console.log(`   ✅ Active: ${debug.isActive ? 'YES' : 'NO'}`);
        console.log(`   🔐 Has password hash: ${debug.hasPassword ? 'YES' : 'NO'}`);
        console.log(`   🔐 Hash length: ${debug.passwordHashLength || 'N/A'}`);
        console.log(`   🔐 Is bcrypt format: ${debug.passwordStartsWithBcrypt ? 'YES' : 'NO'}`);
        console.log(`   🎯 Password match: ${debug.passwordMatch ? 'YES' : 'NO'}`);
        console.log(`   🏥 Hospital ID: ${debug.hospitalId || 'None'}`);
        console.log(`   🏪 Shop ID: ${debug.shopId || 'None'}`);
        console.log(`   📅 Last login: ${debug.lastLogin || 'Never'}`);
        
        if (debug.matchError) {
            console.log(`   ❌ Password match error: ${debug.matchError}`);
        }
    } else {
        console.log(`   ❌ Debug analysis failed: ${debugResult.error}`);
    }
    
    // Then try actual login
    console.log('   🔑 Attempting login...');
    const loginResult = await makeLoginRequest('/login', credentials);
    
    if (loginResult.success) {
        console.log(`   ✅ Login successful!`);
        console.log(`   👤 Logged in as: ${loginResult.user?.firstName} ${loginResult.user?.lastName}`);
        console.log(`   🎭 Role: ${loginResult.user?.role}`);
        return true;
    } else {
        console.log(`   ❌ Login failed: ${loginResult.message}`);
        console.log(`   🔢 Status code: ${loginResult.status}`);
        return false;
    }
};

// Test all accounts
const testAllAccounts = async () => {
    const results = [];
    
    for (const [name, credentials] of Object.entries(TEST_ACCOUNTS)) {
        const result = await testAccount(name, credentials);
        results.push({ name, success: result });
        
        // Wait between tests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Summary
    console.log('\n📊 Test Results Summary');
    console.log('========================');
    
    results.forEach(({ name, success }) => {
        const status = success ? '✅' : '❌';
        console.log(`${status} ${name}: ${success ? 'PASS' : 'FAIL'}`);
    });
    
    const passedTests = results.filter(r => r.success).length;
    const totalTests = results.length;
    
    console.log(`\n🎯 Overall: ${passedTests}/${totalTests} accounts working`);
    
    if (passedTests < totalTests) {
        console.log('\n🔧 Troubleshooting Recommendations:');
        console.log('   1. Check if passwords are being hashed during user creation');
        console.log('   2. Verify pre-save middleware is working in User model');
        console.log('   3. Check if bcrypt.compare is working correctly');
        console.log('   4. Ensure database has the correct user records');
        console.log('   5. Run: npm run seed sample (to recreate test accounts)');
    } else {
        console.log('\n🎉 All test accounts are working correctly!');
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
        console.log('🔗 Backend server is running');
        console.log('📡 Debug endpoints are available');
        
        await testAllAccounts();
        
        console.log('\n🛠️  Manual Testing:');
        console.log('   - Test credentials: POST http://localhost:5000/api/auth/debug/test-credentials');
        console.log('   - Login: POST http://localhost:5000/api/auth/login');
        console.log('   - Frontend: http://localhost:3000/login');
    }
})();
