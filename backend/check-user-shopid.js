const mongoose = require('mongoose');
require('dotenv').config();

async function checkUserShopId() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const User = require('./src/models/User');
        const Shop = require('./src/models/Shop');
        
        const email = 'msiri@gmail.com';
        console.log('🔍 Checking shopId for:', email);
        
        const user = await User.findOne({ email });
        
        if (!user) {
            console.log('❌ User not found');
            return;
        }
        
        console.log('👤 User found:');
        console.log('- ID:', user._id);
        console.log('- Email:', user.email);
        console.log('- Role:', user.role);
        console.log('- Shop ID:', user.shopId);
        
        if (user.shopId) {
            const shop = await Shop.findById(user.shopId);
            if (shop) {
                console.log('🏪 Associated shop:');
                console.log('- Shop Name:', shop.name);
                console.log('- Shop ID:', shop._id);
                console.log('- Shop Active:', shop.isActive);
                console.log('- Admin ID matches:', shop.adminId?.toString() === user._id.toString());
            } else {
                console.log('❌ Shop not found for ID:', user.shopId);
            }
        } else {
            console.log('❌ User has no shopId assigned');
        }
        
        await mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkUserShopId();
