const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function testSpecificPasswords() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const User = require('./src/models/User');
        
        const email = 'msiri@gmail.com';
        
        
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            
            return;
        }
        
        // Test more specific passwords based on the user info
        const testPasswords = [
            'Sarayu123!',
            'sarayu123!',
            'Sarayu@123',
            'sarayu@123',
            'Mandhapati123',
            'mandhapati123',
            'msiri123',
            'Msiri123',
            'msiri@123',
            'Msiri@123',
            '9876543210',
            'SarayuM123',
            'sarayum123',
            'SM123456',
            'sm123456'
        ];
        
        let found = false;
        for (const testPassword of testPasswords) {
            try {
                const isMatch = await bcrypt.compare(testPassword, user.password);
                
                if (isMatch) {
                    found = true;
                    break;
                }
            } catch (err) {
                
            }
        }
        
        if (!found) {
            
            
            
        }
        
        await mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

testSpecificPasswords();
