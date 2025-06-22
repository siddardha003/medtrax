const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function testPassword() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const User = require('./src/models/User');
        
        const email = 'msiri@gmail.com';
        const testPassword = 'Siri@1020';
        
        console.log('🔍 Testing password for:', email);
        console.log('🔑 Testing password:', testPassword);
        
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            console.log('❌ User not found');
            return;
        }
        
        console.log('👤 User found, testing password...');
        
        const isMatch = await bcrypt.compare(testPassword, user.password);
        console.log(`🎯 Password match result: ${isMatch ? '✅ MATCH!' : '❌ No match'}`);
        
        if (isMatch) {
            console.log('✅ The password is correct! User should be able to log in.');
        } else {
            console.log('❌ Password does not match the stored hash.');
            console.log('🔐 Stored hash:', user.password.substring(0, 30) + '...');
            
            // Test if we can create the same hash
            console.log('🧪 Testing hash generation...');
            const salt = await bcrypt.genSalt(12);
            const newHash = await bcrypt.hash(testPassword, salt);
            console.log('🔐 New hash:', newHash.substring(0, 30) + '...');
            
            const newMatch = await bcrypt.compare(testPassword, newHash);
            console.log('🧪 New hash works:', newMatch ? '✅ YES' : '❌ NO');
        }
        
        await mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

testPassword();
