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
    
    
    
    
    // First, use debug endpoint to check credentials
    
    const debugResult = await testCredentials(credentials);
    
    if (debugResult.success) {
        const debug = debugResult.data;
        
        
        
        
        
        
        
        
        
        
        
        
        if (debug.matchError) {
            
        }
    } else {
        
    }
    
    // Then try actual login
    
    const loginResult = await makeLoginRequest('/login', credentials);
    
    if (loginResult.success) {
        
        
        
        return true;
    } else {
        
        
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
    
    
    
    results.forEach(({ name, success }) => {
        const status = success ? '✅' : '❌';
        
    });
    
    const passedTests = results.filter(r => r.success).length;
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
        
        
        
        await testAllAccounts();
        
        
        
        
        
    }
})();
