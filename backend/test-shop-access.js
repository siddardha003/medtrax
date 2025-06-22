#!/usr/bin/env node

/**
 * Test script to debug shop admin access issues
 * 
 * This script tests:
 * 1. Shop admin login
 * 2. Authentication token
 * 3. Shop access validation
 * 4. Inventory API access
 * 
 * Usage: node test-shop-access.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

// Test shop admin credentials from seeder
const SHOP_ADMIN_CREDENTIALS = {
    email: 'shop1@medtrax.com',
    password: 'Shop@123'
};

console.log('🏪 Testing Shop Admin Access');
console.log('=============================\n');

// Helper function to make authenticated request
const makeAuthenticatedRequest = async (endpoint, token, method = 'GET', data = null) => {
    try {
        const config = {
            method,
            url: `${BASE_URL}${endpoint}`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };
        
        if (data) {
            config.data = data;
        }
        
        const response = await axios(config);
        return {
            success: true,
            status: response.status,
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

// Test shop admin login
const testShopAdminLogin = async () => {
    console.log('1️⃣  Testing shop admin login...');
    console.log(`   Email: ${SHOP_ADMIN_CREDENTIALS.email}`);
    console.log(`   Password: ${SHOP_ADMIN_CREDENTIALS.password}`);
    
    try {
        const response = await axios.post(`${BASE_URL}/api/auth/login`, SHOP_ADMIN_CREDENTIALS);
        
        if (response.data.success) {
            const user = response.data.data.user;
            const token = response.data.data.token;
            
            console.log('   ✅ Login successful!');
            console.log(`   👤 User: ${user.firstName} ${user.lastName}`);
            console.log(`   🎭 Role: ${user.role}`);
            console.log(`   🆔 User ID: ${user._id}`);
            console.log(`   🏪 Shop ID: ${user.shopId || 'None'}`);
            console.log(`   🔑 Token: ${token.substring(0, 20)}...`);
            
            return { success: true, token, user };
        } else {
            console.log('   ❌ Login failed');
            console.log(`   📝 Message: ${response.data.error}`);
            return { success: false };
        }
    } catch (error) {
        console.log('   ❌ Login error');
        console.log(`   📝 Error: ${error.response?.data?.error || error.message}`);
        return { success: false };
    }
};

// Test debug access endpoint
const testDebugAccess = async (token) => {
    console.log('\n2️⃣  Testing debug access endpoint...');
    
    const result = await makeAuthenticatedRequest('/api/shop/debug/access', token);
    
    if (result.success) {
        console.log('   ✅ Debug access successful!');
        const debug = result.data.data;
        
        console.log('   📊 Authentication Info:');
        console.log(`      - User found: ${debug.authentication.userFound}`);
        console.log(`      - Email: ${debug.authentication.email}`);
        console.log(`      - Role: ${debug.authentication.role}`);
        console.log(`      - Active: ${debug.authentication.isActive}`);
        console.log(`      - Shop ID: ${debug.authentication.shopId || 'None'}`);
        
        console.log('   🎭 Authorization Info:');
        console.log(`      - Has shop admin role: ${debug.authorization.hasShopAdminRole}`);
        console.log(`      - Has shop ID: ${debug.authorization.hasShopId}`);
        
        if (debug.shopValidation) {
            console.log('   🏪 Shop Validation:');
            console.log(`      - Shop exists: ${debug.shopValidation.shopExists}`);
            console.log(`      - Shop name: ${debug.shopValidation.shopName || 'N/A'}`);
            console.log(`      - Shop active: ${debug.shopValidation.shopActive}`);
            console.log(`      - Shop type: ${debug.shopValidation.shopType || 'N/A'}`);
        }
        
        return debug;
    } else {
        console.log('   ❌ Debug access failed');
        console.log(`   📝 Status: ${result.status}`);
        console.log(`   📝 Error: ${result.message}`);
        return null;
    }
};

// Test inventory access
const testInventoryAccess = async (token) => {
    console.log('\n3️⃣  Testing inventory access...');
    
    const result = await makeAuthenticatedRequest('/api/shop/inventory?limit=5', token);
    
    if (result.success) {
        console.log('   ✅ Inventory access successful!');
        console.log(`   📦 Items found: ${result.data.data?.items?.length || 0}`);
        console.log(`   📊 Total items: ${result.data.data?.pagination?.totalItems || 0}`);
        return true;
    } else {
        console.log('   ❌ Inventory access failed');
        console.log(`   📝 Status: ${result.status}`);
        console.log(`   📝 Error: ${result.message}`);
        
        // Show detailed error info
        if (result.data) {
            console.log(`   🔍 Full error response:`, JSON.stringify(result.data, null, 2));
        }
        
        return false;
    }
};

// Test user profile
const testUserProfile = async (token) => {
    console.log('\n4️⃣  Testing user profile access...');
    
    const result = await makeAuthenticatedRequest('/api/auth/me', token);
    
    if (result.success) {
        const user = result.data.data.user;
        console.log('   ✅ Profile access successful!');
        console.log(`   👤 User: ${user.firstName} ${user.lastName}`);
        console.log(`   🎭 Role: ${user.role}`);
        console.log(`   🏪 Shop ID: ${user.shopId || 'None'}`);
        console.log(`   🏥 Hospital ID: ${user.hospitalId || 'None'}`);
        return user;
    } else {
        console.log('   ❌ Profile access failed');
        console.log(`   📝 Error: ${result.message}`);
        return null;
    }
};

// Main test function
const runTests = async () => {
    // Test 1: Login
    const loginResult = await testShopAdminLogin();
    if (!loginResult.success) {
        console.log('\n❌ Cannot proceed without successful login');
        console.log('\n🔧 Troubleshooting steps:');
        console.log('   1. Ensure backend server is running');
        console.log('   2. Run: npm run seed sample');
        console.log('   3. Check if shop admin account exists');
        return;
    }
    
    const { token, user } = loginResult;
    
    // Test 2: Debug access
    const debugInfo = await testDebugAccess(token);
    
    // Test 3: User profile
    const profileInfo = await testUserProfile(token);
    
    // Test 4: Inventory access
    const inventoryAccess = await testInventoryAccess(token);
    
    // Summary
    console.log('\n📊 Test Summary');
    console.log('================');
    console.log(`✅ Login: SUCCESS`);
    console.log(`${debugInfo ? '✅' : '❌'} Debug Access: ${debugInfo ? 'SUCCESS' : 'FAILED'}`);
    console.log(`${profileInfo ? '✅' : '❌'} Profile Access: ${profileInfo ? 'SUCCESS' : 'FAILED'}`);
    console.log(`${inventoryAccess ? '✅' : '❌'} Inventory Access: ${inventoryAccess ? 'SUCCESS' : 'FAILED'}`);
    
    if (!inventoryAccess) {
        console.log('\n🔧 Possible Issues:');
        console.log('   1. Shop admin user missing shopId association');
        console.log('   2. Associated shop not found or inactive');
        console.log('   3. Role validation middleware failing');
        console.log('   4. Database connection issues');
        
        if (debugInfo) {
            if (!debugInfo.authorization.hasShopId) {
                console.log('\n❌ ISSUE IDENTIFIED: Shop admin user has no shopId');
                console.log('   🔧 Fix: Re-run seeder or manually assign shopId to user');
            } else if (debugInfo.shopValidation && !debugInfo.shopValidation.shopExists) {
                console.log('\n❌ ISSUE IDENTIFIED: Associated shop does not exist');
                console.log('   🔧 Fix: Create shop or fix shop association');
            } else if (debugInfo.shopValidation && !debugInfo.shopValidation.shopActive) {
                console.log('\n❌ ISSUE IDENTIFIED: Associated shop is inactive');
                console.log('   🔧 Fix: Activate the shop in database');
            }
        }
    } else {
        console.log('\n🎉 All tests passed! Shop admin access is working correctly.');
    }
};

// Check server connectivity first
const checkServer = async () => {
    try {
        await axios.get(`${BASE_URL}/api/auth/debug/routes`);
        return true;
    } catch (error) {
        console.log('❌ Backend server is not running or not accessible');
        console.log('🔧 Please start the backend server with: npm start');
        return false;
    }
};

// Main execution
(async () => {
    const serverRunning = await checkServer();
    
    if (serverRunning) {
        console.log('🔗 Backend server is running\n');
        await runTests();
    }
})();
