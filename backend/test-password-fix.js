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
        
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
};

// Fix admin passwords
const fixAdminPasswords = async () => {
    try {
        
        
        
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
            
            
            const user = await User.findOne({ email: account.email }).select('+password');
            
            if (!user) {
                
                notFoundCount++;
                continue;
            }
            
            
            
            // Check if current password works
            const currentPasswordWorks = await user.matchPassword(account.password);
            
            
            if (!currentPasswordWorks) {
                
                
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
                    
                    fixedCount++;
                } else {
                    
                }
            } else {
                
            }
        }
        
        
        
        
        
        
        if (fixedCount > 0) {
            
            
            adminAccounts.forEach(account => {
                
            });
        } else if (notFoundCount > 0) {
            
            
            
        } else {
            
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
        
    } catch (error) {
        console.error('❌ Error in admin password fix:', error.message);
    } finally {
        await mongoose.connection.close();
        
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
                
                
                
                
            } catch (error) {
                console.error('❌ Error checking admin users:', error.message);
            } finally {
                await mongoose.connection.close();
            }
        })();
        break;
    default:
        
        
        
        
        
        
        
        
        
        
        
        
        break;
}

module.exports = {
    fixAdminPasswords
};
