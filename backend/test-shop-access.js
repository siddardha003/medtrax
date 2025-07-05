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
    
    
    
    
    try {
        const response = await axios.post(`${BASE_URL}/api/auth/login`, SHOP_ADMIN_CREDENTIALS);
        
        if (response.data.success) {
            const user = response.data.data.user;
            const token = response.data.data.token;
            
            
            
            
            
            
          
            
            return { success: true, token, user };
        } else {
            
            
            return { success: false };
        }
    } catch (error) {
        
        
        return { success: false };
    }
};

// Test debug access endpoint
const testDebugAccess = async (token) => {
    
    
    const result = await makeAuthenticatedRequest('/api/shop/debug/access', token);
    
    if (result.success) {
        
        const debug = result.data.data;
        
        
        
        
        
        
        
        
        
        
        
        
        if (debug.shopValidation) {
            
            
            
            
            
        }
        
        return debug;
    } else {
        
        
        
        return null;
    }
};

// Test inventory access
const testInventoryAccess = async (token) => {
    
    
    const result = await makeAuthenticatedRequest('/api/shop/inventory?limit=5', token);
    
    if (result.success) {
        
        
        
        return true;
    } else {
        
        
        
        
        // Show detailed error info
       
        return false;
    }
};

// Test user profile
const testUserProfile = async (token) => {
    
    
    const result = await makeAuthenticatedRequest('/api/auth/me', token);
    
    if (result.success) {
        const user = result.data.data.user;
        
        
        
        
        
        return user;
    } else {
        
        
        return null;
    }
};

// Main test function
const runTests = async () => {
    // Test 1: Login
    const loginResult = await testShopAdminLogin();
    if (!loginResult.success) {
        
        
        
        
        
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
    
    
    
    
    
    
    
    if (!inventoryAccess) {
        
        
        
        
        
        
        if (debugInfo) {
            if (!debugInfo.authorization.hasShopId) {
                
                
            } else if (debugInfo.shopValidation && !debugInfo.shopValidation.shopExists) {
                
                
            } else if (debugInfo.shopValidation && !debugInfo.shopValidation.shopActive) {
                
                
            }
        }
    } else {
        
    }
};

// Check server connectivity first
const checkServer = async () => {
    try {
        await axios.get(`${BASE_URL}/api/auth/debug/routes`);
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
