const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function testLogin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const User = require('./src/models/User');
        const Shop = require('./src/models/Shop');
        
        const email = 'msiri@gmail.com';
        console.log('🔍 Testing login for:', email);
        
        // Find user with password field included
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            console.log('❌ User not found');
            return;
        }
        
        console.log('👤 User found:');
        console.log('- ID:', user._id);
        console.log('- Email:', user.email);
        console.log('- Role:', user.role);
        console.log('- Is Active:', user.isActive);
        console.log('- Shop ID:', user.shopId);
        console.log('- Password hash exists:', !!user.password);
        console.log('- Password hash length:', user.password ? user.password.length : 0);
        console.log('- Hash starts with $2:', user.password ? user.password.startsWith('$2') : false);
        
        // Test password comparison with common passwords
        const testPasswords = ['123456', 'password', 'admin123', 'Sarayu123', 'Test123!', 'sarayu123'];
        
        for (const testPassword of testPasswords) {
            try {
                const isMatch = await bcrypt.compare(testPassword, user.password);
                console.log(`🔑 Password '${testPassword}': ${isMatch ? '✅ MATCH' : '❌ No match'}`);
                if (isMatch) break;
            } catch (err) {
                console.log(`🔑 Password '${testPassword}': ❌ Error -`, err.message);
            }
        }
        
        // Check associated shop
        if (user.shopId) {
            const shop = await Shop.findById(user.shopId);
            if (shop) {
                console.log('🏪 Associated shop found:');
                console.log('- Shop Name:', shop.name);
                console.log('- Shop Active:', shop.isActive);
                console.log('- Admin ID matches:', shop.adminId?.toString() === user._id.toString());
            } else {
                console.log('❌ Shop not found for ID:', user.shopId);
            }
        }
        
        await mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

testLogin();
