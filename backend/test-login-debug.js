const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function testLogin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const User = require('./src/models/User');
        const Shop = require('./src/models/Shop');
        
        const email = 'msiri@gmail.com';
        
        
        // Find user with password field included
        const user = await User.findOne({ email }).select('+password');
        
        

        
        // Test password comparison with common passwords
        const testPasswords = ['123456', 'password', 'admin123', 'Sarayu123', 'Test123!', 'sarayu123'];
        
        for (const testPassword of testPasswords) {
            try {
                const isMatch = await bcrypt.compare(testPassword, user.password);
                
                if (isMatch) break;
            } catch (err) {
                
            }
        }
        
        // Check associated shop
        if (user.shopId) {
            const shop = await Shop.findById(user.shopId);
        }
        
        await mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

testLogin();
