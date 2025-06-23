const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function testSpecificPasswords() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const User = require('./src/models/User');
        
        const email = 'msiri@gmail.com';
        console.log('🔍 Testing specific passwords for:', email);
        
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            console.log('❌ User not found');
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
                console.log(`🔑 Password '${testPassword}': ${isMatch ? '✅ MATCH' : '❌ No match'}`);
                if (isMatch) {
                    found = true;
                    break;
                }
            } catch (err) {
                console.log(`🔑 Password '${testPassword}': ❌ Error -`, err.message);
            }
        }
        
        if (!found) {
            console.log('❌ None of the test passwords matched.');
            console.log('💡 The password might be auto-generated. Check your email or logs.');
            console.log('💡 Or try the exact password you entered when creating this user.');
        }
        
        await mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

testSpecificPasswords();
