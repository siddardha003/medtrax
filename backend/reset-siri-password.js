const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function resetSpecificPassword() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const User = require('./src/models/User');
        
        const email = 'msiri@gmail.com';
        const correctPassword = 'Siri@1020';
        
        console.log('🔧 Resetting password for:', email);
        console.log('🔑 Setting password to:', correctPassword);
        
        // Hash the password properly
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(correctPassword, salt);
        
        console.log('🔐 Generated hash:', hashedPassword.substring(0, 30) + '...');
        
        // Test the hash immediately
        const testMatch = await bcrypt.compare(correctPassword, hashedPassword);
        console.log('🧪 Hash test:', testMatch ? '✅ WORKS' : '❌ BROKEN');
        
        // Update the user's password
        const result = await User.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        );
        
        if (result) {
            console.log('✅ Password reset successful!');
            console.log('📧 Email:', email);
            console.log('🔑 Password:', correctPassword);
            console.log('');
            console.log('You can now log in with these credentials.');
            
            // Double-check by reading back
            const userCheck = await User.findOne({ email }).select('+password');
            const finalTest = await bcrypt.compare(correctPassword, userCheck.password);
            console.log('🔍 Final verification:', finalTest ? '✅ SUCCESS' : '❌ FAILED');
        } else {
            console.log('❌ User not found');
        }
        
        await mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

resetSpecificPassword();
