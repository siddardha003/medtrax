const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function resetSpecificPassword() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const User = require('./src/models/User');
        
        const email = 'msiri@gmail.com';
        const correctPassword = 'Siri@1020';
        
        
        
        
        // Hash the password properly
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(correctPassword, salt);
        
        // Test the hash immediately
        const testMatch = await bcrypt.compare(correctPassword, hashedPassword);
        
        
        // Update the user's password
        const result = await User.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        );
        
        if (result) {
            
            
            
            
            
            
            // Double-check by reading back
            const userCheck = await User.findOne({ email }).select('+password');
            const finalTest = await bcrypt.compare(correctPassword, userCheck.password);
            
        } else {
            
        }
        
        await mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

resetSpecificPassword();
