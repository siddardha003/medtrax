#!/usr/bin/env node

/**
 * Fix Shop Admin Access Issues
 * 
 * This script identifies and fixes common shop admin access problems:
 * 1. Shop admin users missing shopId
 * 2. Inactive shops
 * 3. Missing shop associations
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./src/models/User');
const Shop = require('./src/models/Shop');

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

// Analyze shop admin issues
const analyzeShopAdmins = async () => {
    console.log('🔍 Analyzing Shop Admin Issues');
    console.log('==============================\n');
    
    try {
        // Get all shop admin users
        const shopAdmins = await User.find({ role: 'shop_admin' });
        console.log(`👥 Found ${shopAdmins.length} shop admin users\n`);
        
        const issues = [];
        
        for (const admin of shopAdmins) {
            console.log(`🔍 Checking: ${admin.email}`);
            const userIssues = [];
            
            // Check if user has shopId
            if (!admin.shopId) {
                userIssues.push('No shopId associated');
                console.log(`   ❌ No shopId associated`);
            } else {
                console.log(`   🏪 Shop ID: ${admin.shopId}`);
                
                // Check if shop exists
                const shop = await Shop.findById(admin.shopId);
                if (!shop) {
                    userIssues.push('Associated shop not found');
                    console.log(`   ❌ Associated shop not found`);
                } else {
                    console.log(`   🏪 Shop: ${shop.name}`);
                    
                    // Check if shop is active
                    if (!shop.isActive) {
                        userIssues.push('Associated shop is inactive');
                        console.log(`   ❌ Shop is inactive`);
                    } else {
                        console.log(`   ✅ Shop is active`);
                    }
                }
            }
            
            // Check if user is active
            if (!admin.isActive) {
                userIssues.push('User account is inactive');
                console.log(`   ❌ User account is inactive`);
            } else {
                console.log(`   ✅ User account is active`);
            }
            
            if (userIssues.length > 0) {
                issues.push({
                    user: admin,
                    issues: userIssues
                });
            } else {
                console.log(`   ✅ No issues found`);
            }
            
            console.log('');
        }
        
        return issues;
        
    } catch (error) {
        console.error('❌ Error analyzing shop admins:', error.message);
        return [];
    }
};

// Fix shop admin issues
const fixShopAdminIssues = async () => {
    console.log('🔧 Fixing Shop Admin Issues');
    console.log('============================\n');
    
    try {
        const issues = await analyzeShopAdmins();
        
        if (issues.length === 0) {
            console.log('🎉 No issues found! All shop admins are properly configured.');
            return;
        }
        
        console.log(`📋 Found ${issues.length} users with issues:\n`);
        
        for (const { user, issues: userIssues } of issues) {
            console.log(`🔧 Fixing issues for: ${user.email}`);
            
            for (const issue of userIssues) {
                console.log(`   📝 Issue: ${issue}`);
                
                if (issue === 'No shopId associated') {
                    // Try to find a shop that doesn't have an admin yet
                    const availableShop = await Shop.findOne({ 
                        isActive: true,
                        $or: [
                            { adminId: { $exists: false } },
                            { adminId: null }
                        ]
                    });
                    
                    if (availableShop) {
                        // Associate user with shop
                        await User.updateOne(
                            { _id: user._id },
                            { shopId: availableShop._id }
                        );
                        
                        // Associate shop with user
                        await Shop.updateOne(
                            { _id: availableShop._id },
                            { adminId: user._id }
                        );
                        
                        console.log(`   ✅ Associated with shop: ${availableShop.name}`);
                    } else {
                        console.log(`   ⚠️  No available shops found for association`);
                    }
                }
                
                if (issue === 'Associated shop is inactive') {
                    // Activate the shop
                    await Shop.updateOne(
                        { _id: user.shopId },
                        { isActive: true }
                    );
                    console.log(`   ✅ Activated associated shop`);
                }
                
                if (issue === 'User account is inactive') {
                    // Activate the user
                    await User.updateOne(
                        { _id: user._id },
                        { isActive: true }
                    );
                    console.log(`   ✅ Activated user account`);
                }
            }
            
            console.log('');
        }
        
        console.log('🎉 Shop admin fixes completed!');
        
    } catch (error) {
        console.error('❌ Error fixing shop admin issues:', error.message);
    }
};

// List all shops and their admin status
const listShopsWithAdmins = async () => {
    console.log('🏪 Shop and Admin Status Report');
    console.log('================================\n');
    
    try {
        const shops = await Shop.find({}).populate('adminId', 'email firstName lastName role');
        
        console.log(`Found ${shops.length} shops:\n`);
        
        for (const shop of shops) {
            console.log(`🏪 ${shop.name}`);
            console.log(`   📧 Email: ${shop.email}`);
            console.log(`   🏷️  Type: ${shop.shopType}`);
            console.log(`   ✅ Active: ${shop.isActive ? 'YES' : 'NO'}`);
            console.log(`   ✅ Verified: ${shop.isVerified ? 'YES' : 'NO'}`);
            
            if (shop.adminId) {
                console.log(`   👤 Admin: ${shop.adminId.firstName} ${shop.adminId.lastName}`);
                console.log(`   📧 Admin Email: ${shop.adminId.email}`);
                console.log(`   🎭 Admin Role: ${shop.adminId.role}`);
            } else {
                console.log(`   ❌ No admin assigned`);
            }
            
            console.log('');
        }
        
    } catch (error) {
        console.error('❌ Error listing shops:', error.message);
    }
};

// Command line interface
const command = process.argv[2];

const runCommand = async (commandFunction, name) => {
    try {
        await connectDB();
        await commandFunction();
        console.log(`✅ ${name} completed successfully`);
    } catch (error) {
        console.error(`❌ Error in ${name}:`, error.message);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
};

switch (command) {
    case 'analyze':
        runCommand(analyzeShopAdmins, 'Shop admin analysis');
        break;
    case 'fix':
        runCommand(fixShopAdminIssues, 'Shop admin fixes');
        break;
    case 'list':
        runCommand(listShopsWithAdmins, 'Shop listing');
        break;
    default:
        console.log('🔧 Shop Admin Fix Utility');
        console.log('==========================');
        console.log('Usage:');
        console.log('   node fix-shop-access.js analyze  - Analyze shop admin issues');
        console.log('   node fix-shop-access.js fix      - Fix shop admin issues');
        console.log('   node fix-shop-access.js list     - List all shops and their admins');
        console.log('');
        console.log('This utility helps fix common shop admin access issues:');
        console.log('1. Shop admin users missing shopId');
        console.log('2. Inactive shops');
        console.log('3. Missing admin associations');
        console.log('');
        console.log('Make sure MongoDB is running and .env is configured');
        break;
}

module.exports = {
    analyzeShopAdmins,
    fixShopAdminIssues,
    listShopsWithAdmins
};
