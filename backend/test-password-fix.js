#!/usr/bin/env node

/**
 * Fix Admin Passwords Utility
 * 
 * This script fixes password hashing issues for admin users
 * by re-hashing their passwords correctly
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('./src/models/User');

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
};

// Fix admin passwords
const fixAdminPasswords = async () => {
    try {
        console.log('🔧 Fixing Admin Passwords');
        console.log('=========================\n');
        
        // Define the correct passwords for seeded accounts
        const adminAccounts = [
            { email: 'admin@medtrax.com', password: 'Admin@123', role: 'super_admin' },
            { email: 'hospital1@medtrax.com', password: 'Hospital@123', role: 'hospital_admin' },
            { email: 'hospital2@medtrax.com', password: 'Hospital@123', role: 'hospital_admin' },
            { email: 'hospital3@medtrax.com', password: 'Hospital@123', role: 'hospital_admin' },
            { email: 'shop1@medtrax.com', password: 'Shop@123', role: 'shop_admin' },
            { email: 'shop2@medtrax.com', password: 'Shop@123', role: 'shop_admin' },
            { email: 'shop3@medtrax.com', password: 'Shop@123', role: 'shop_admin' }
        ];
        
        let fixedCount = 0;
        let notFoundCount = 0;
        
        for (const account of adminAccounts) {
            console.log(`🔍 Checking ${account.email}...`);
            
            const user = await User.findOne({ email: account.email }).select('+password');
            
            if (!user) {
                console.log(`   ❌ User not found: ${account.email}`);
                notFoundCount++;
                continue;
            }
            
            console.log(`   👤 Found user: ${user.firstName} ${user.lastName} (${user.role})`);
            
            // Check if current password works
            const currentPasswordWorks = await user.matchPassword(account.password);
            console.log(`   🔑 Current password works: ${currentPasswordWorks ? 'YES' : 'NO'}`);
            
            if (!currentPasswordWorks) {
                console.log(`   🔧 Fixing password for ${account.email}...`);
                
                // Manually hash the password
                const salt = await bcrypt.genSalt(12);
                const hashedPassword = await bcrypt.hash(account.password, salt);
                
                // Update the user directly in the database (bypass mongoose middleware)
                await User.updateOne(
                    { _id: user._id },
                    { 
                        password: hashedPassword,
                        updatedAt: new Date()
                    }
                );
                
                // Verify the fix
                const updatedUser = await User.findById(user._id).select('+password');
                const fixedPasswordWorks = await updatedUser.matchPassword(account.password);
                
                if (fixedPasswordWorks) {
                    console.log(`   ✅ Password fixed successfully for ${account.email}`);
                    fixedCount++;
                } else {
                    console.log(`   ❌ Password fix failed for ${account.email}`);
                }
            } else {
                console.log(`   ✅ Password already working for ${account.email}`);
            }
        }
        
        console.log('\n📊 Fix Summary:');
        console.log(`   🔧 Passwords fixed: ${fixedCount}`);
        console.log(`   ❌ Users not found: ${notFoundCount}`);
        console.log(`   ✅ Total accounts checked: ${adminAccounts.length}`);
        
        if (fixedCount > 0) {
            console.log('\n🎉 Password fixes applied successfully!');
            console.log('📝 You can now test login with these credentials:');
            adminAccounts.forEach(account => {
                console.log(`   - ${account.email} / ${account.password}`);
            });
        } else if (notFoundCount > 0) {
            console.log('\n⚠️  Some users were not found. You may need to:');
            console.log('   1. Run the seeder: npm run seed sample');
            console.log('   2. Check if the email addresses are correct');
        } else {
            console.log('\n✅ All admin passwords are already working correctly!');
        }
        
    } catch (error) {
        console.error('❌ Error fixing admin passwords:', error.message);
        console.error(error.stack);
    }
};

// Command line interface
const command = process.argv[2];

const runFix = async () => {
    try {
        await connectDB();
        await fixAdminPasswords();
        console.log('✅ Admin password fix completed');
    } catch (error) {
        console.error('❌ Error in admin password fix:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
};

switch (command) {
    case 'fix':
        runFix();
        break;
    case 'check':
        (async () => {
            try {
                await connectDB();
                // Just check without fixing
                const users = await User.find({ 
                    role: { $in: ['super_admin', 'hospital_admin', 'shop_admin'] } 
                }).select('email role firstName lastName');
                
                console.log('🔍 Found admin users:');
                users.forEach(user => {
                    console.log(`   - ${user.email} (${user.role}) - ${user.firstName} ${user.lastName}`);
                });
                
            } catch (error) {
                console.error('❌ Error checking admin users:', error.message);
            } finally {
                await mongoose.connection.close();
            }
        })();
        break;
    default:
        console.log('🔧 Admin Password Fix Utility');
        console.log('==============================');
        console.log('Usage:');
        console.log('   node test-password-fix.js check  - List all admin users');
        console.log('   node test-password-fix.js fix    - Fix admin passwords');
        console.log('');
        console.log('This utility will:');
        console.log('1. Check if admin users exist');
        console.log('2. Test if their passwords work');
        console.log('3. Fix any broken password hashes');
        console.log('');
        console.log('Make sure MongoDB is running and .env is configured');
        break;
}

module.exports = {
    fixAdminPasswords
};
