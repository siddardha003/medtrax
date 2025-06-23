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
    console.log('🔐 Password Hashing Test');
    console.log('========================\n');
    
    const testPassword = 'Hospital@123';
    console.log(`🔑 Test password: "${testPassword}"`);
    
    // Test 1: Direct bcrypt hashing
    console.log('\n1️⃣  Direct bcrypt test:');
    try {
        const salt = await bcrypt.genSalt(12);
        const hash = await bcrypt.hash(testPassword, salt);
        console.log(`   ✅ Hash generated: ${hash.substring(0, 30)}...`);
        console.log(`   📏 Hash length: ${hash.length}`);
        console.log(`   🔍 Starts with $2: ${hash.startsWith('$2')}`);
        
        const isMatch = await bcrypt.compare(testPassword, hash);
        console.log(`   🎯 Verification: ${isMatch ? 'SUCCESS' : 'FAILED'}`);
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
    }
    
    // Test 2: User model pre-save hook
    console.log('\n2️⃣  User model pre-save hook test:');
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('   🔗 Database connected');
        
        // Create a test user document (without saving)
        const testUser = new User({
            email: 'test@test.com',
            password: testPassword,
            firstName: 'Test',
            lastName: 'User',
            role: 'user'
        });
        
        console.log(`   🔑 Password before save: "${testUser.password}"`);
        console.log(`   📏 Length before save: ${testUser.password.length}`);
        
        // Manually trigger the pre-save middleware
        await testUser.save();
        
        console.log(`   🔐 Password after save: ${testUser.password.substring(0, 30)}...`);
        console.log(`   📏 Length after save: ${testUser.password.length}`);
        console.log(`   🔍 Starts with $2: ${testUser.password.startsWith('$2')}`);
        
        // Test the matchPassword method
        const isMatch = await testUser.matchPassword(testPassword);
        console.log(`   🎯 matchPassword result: ${isMatch ? 'SUCCESS' : 'FAILED'}`);
        
        // Clean up test user
        await User.deleteOne({ _id: testUser._id });
        console.log('   🗑️  Test user cleaned up');
        
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
    } finally {
        await mongoose.connection.close();
        console.log('   🔌 Database disconnected');
    }
};

// Test existing user passwords
const testExistingUser = async (email) => {
    console.log(`\n3️⃣  Testing existing user: ${email}`);
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            console.log('   ❌ User not found');
            return;
        }
        
        console.log(`   👤 User found: ${user.firstName} ${user.lastName}`);
        console.log(`   🎭 Role: ${user.role}`);
        console.log(`   🔐 Password hash: ${user.password.substring(0, 30)}...`);
        console.log(`   📏 Hash length: ${user.password.length}`);
        console.log(`   🔍 Starts with $2: ${user.password.startsWith('$2')}`);
        
        // Test different possible passwords
        const possiblePasswords = [
            'Hospital@123',
            'Shop@123',
            'Admin@123'
        ];
        
        for (const testPwd of possiblePasswords) {
            const isMatch = await user.matchPassword(testPwd);
            console.log(`   🔑 "${testPwd}": ${isMatch ? '✅ MATCH' : '❌ NO MATCH'}`);
        }
        
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
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
    
    console.log('\n🎯 Password Analysis Complete');
    console.log('===============================');
    console.log('If all tests pass but login still fails, the issue might be:');
    console.log('1. Frontend sending incorrect data');
    console.log('2. Middleware interfering with login');
    console.log('3. Database connection issues during login');
    console.log('4. Race conditions in the login process');
})();
