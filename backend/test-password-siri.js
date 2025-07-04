const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function testPassword() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const User = require('./src/models/User');
        
        const email = 'msiri@gmail.com';
        const testPassword = 'Siri@1020';
        
        
        
        
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            
            return;
        }
        
        
        
        const isMatch = await bcrypt.compare(testPassword, user.password);
        
        
        if (isMatch) {
            
        } else {

            
            // Test if we can create the same hash
            
            const salt = await bcrypt.genSalt(12);
            const newHash = await bcrypt.hash(testPassword, salt);
           
            
            const newMatch = await bcrypt.compare(testPassword, newHash);
            
        }
        
        await mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

testPassword();
