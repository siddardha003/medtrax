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
        
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
};

// Analyze shop admin issues
const analyzeShopAdmins = async () => {
    
    
    
    try {
        // Get all shop admin users
        const shopAdmins = await User.find({ role: 'shop_admin' });
        
        
        const issues = [];
        
        for (const admin of shopAdmins) {
            
            const userIssues = [];
            
            // Check if user has shopId
            if (!admin.shopId) {
                userIssues.push('No shopId associated');
                
            } else {
                
                
                // Check if shop exists
                const shop = await Shop.findById(admin.shopId);
                if (!shop) {
                    userIssues.push('Associated shop not found');
                    
                } else {
                    
                    
                    // Check if shop is active
                    if (!shop.isActive) {
                        userIssues.push('Associated shop is inactive');
                        
                    } else {
                        
                    }
                }
            }
            
            // Check if user is active
            if (!admin.isActive) {
                userIssues.push('User account is inactive');
                
            } else {
                
            }
            
            if (userIssues.length > 0) {
                issues.push({
                    user: admin,
                    issues: userIssues
                });
            } else {
                
            }
            
            
        }
        
        return issues;
        
    } catch (error) {
        console.error('❌ Error analyzing shop admins:', error.message);
        return [];
    }
};

// Fix shop admin issues
const fixShopAdminIssues = async () => {
    
    
    
    try {
        const issues = await analyzeShopAdmins();
        
        if (issues.length === 0) {
            
            return;
        }
        
        
        
        for (const { user, issues: userIssues } of issues) {
            
            
            for (const issue of userIssues) {
                
                
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
                        
                        
                    } else {
                        
                    }
                }
                
                if (issue === 'Associated shop is inactive') {
                    // Activate the shop
                    await Shop.updateOne(
                        { _id: user.shopId },
                        { isActive: true }
                    );
                    
                }
                
                if (issue === 'User account is inactive') {
                    // Activate the user
                    await User.updateOne(
                        { _id: user._id },
                        { isActive: true }
                    );
                    
                }
            }
            
            
        }
        
        
        
    } catch (error) {
        console.error('❌ Error fixing shop admin issues:', error.message);
    }
};

// List all shops and their admin status
const listShopsWithAdmins = async () => {
    
    
    
    try {
        const shops = await Shop.find({}).populate('adminId', 'email firstName lastName role');
        
        
        
        for (const shop of shops) {
            
            
            
            
            
            
            if (shop.adminId) {
                
                
                
            } else {
                
            }
            
            
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
        
    } catch (error) {
        console.error(`❌ Error in ${name}:`, error.message);
    } finally {
        await mongoose.connection.close();
        
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
        
        
        
        
        
        
        
        
        
        
        
        
        
        break;
}

module.exports = {
    analyzeShopAdmins,
    fixShopAdminIssues,
    listShopsWithAdmins
};
