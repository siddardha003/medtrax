const mongoose = require('mongoose');
require('dotenv').config();

async function checkUserShopId() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const User = require('./src/models/User');
        const Shop = require('./src/models/Shop');
        
        const email = 'msiri@gmail.com';
        
        
        const user = await User.findOne({ email });
        
        if (!user) {
            
            return;
        }
        
        
        
        
        
        
        
        if (user.shopId) {
            const shop = await Shop.findById(user.shopId);
            if (shop) {
                
                
                
                
            } else {
                
            }
        } else {
            
        }
        
        await mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkUserShopId();
