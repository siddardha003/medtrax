const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function resetPassword() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const User = require('./src/models/User');
        
        const email = 'msiri@gmail.com';
        const newPassword = 'Test123!'; // Easy to remember password
        
        console.log('🔧 Resetting password for:', email);
        console.log('🔑 New password will be:', newPassword);
        
        // Hash the new password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        // Update the user's password
        const result = await User.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        );
        
        if (result) {
            console.log('✅ Password reset successful!');
            console.log('📧 Email:', email);
            console.log('🔑 Password:', newPassword);
            console.log('');
            console.log('You can now log in with these credentials.');
        } else {
            console.log('❌ User not found');
        }
        
        await mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

resetPassword();
