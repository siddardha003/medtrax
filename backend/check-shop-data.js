const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medtrax');

const Shop = require('./src/models/Shop');

async function checkShopData() {
  try {
    const shops = await Shop.find({}).limit(3).select('name images ownerName ownerPhone ownerEmail services location profileComplete');
    
    shops.forEach(shop => {
    });
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkShopData();
