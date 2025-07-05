#!/usr/bin/env node

/**
 * Password Hash Verification Utility
 * 
 * This script directly tests password hashing and verification
 * to help identify if the issue is in hashing or comparison
 */

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

// Import User model
const User = require('./src/models/User');

// Test password hashing
const testPasswordHashing = async () => {
    
    
    
    const testPassword = 'Hospital@123';
    
    
    // Test 1: Direct bcrypt hashing
    
    try {
        const salt = await bcrypt.genSalt(12);
        const hash = await bcrypt.hash(testPassword, salt);
        
        
        const isMatch = await bcrypt.compare(testPassword, hash);
        
    } catch (error) {
        
    }
    
    // Test 2: User model pre-save hook
    
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        
        // Create a test user document (without saving)
        const testUser = new User({
            email: 'test@test.com',
            password: testPassword,
            firstName: 'Test',
            lastName: 'User',
            role: 'user'
        });
        
        
        
        
        // Manually trigger the pre-save middleware
        await testUser.save();
        
        
        // Test the matchPassword method
        const isMatch = await testUser.matchPassword(testPassword);
        
        
        // Clean up test user
        await User.deleteOne({ _id: testUser._id });
        
        
    } catch (error) {
        
    } finally {
        await mongoose.connection.close();
        
    }
};

// Test existing user passwords
const testExistingUser = async (email) => {
    
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            
            return;
        }
        
        
        
        
        // Test different possible passwords
        const possiblePasswords = [
            'Hospital@123',
            'Shop@123',
            'Admin@123'
        ];
        
        for (const testPwd of possiblePasswords) {
            const isMatch = await user.matchPassword(testPwd);
            
        }
        
    } catch (error) {
        
    } finally {
        await mongoose.connection.close();
    }
};

// Main execution
(async () => {
    await testPasswordHashing();
    
    // Test some existing users
    const testUsers = [
        'admin@medtrax.com',
        'hospital1@medtrax.com',
        'shop1@medtrax.com'
    ];
    
    for (const email of testUsers) {
        await testExistingUser(email);
    }
    
    
    
    
    
    
    
    
})();
