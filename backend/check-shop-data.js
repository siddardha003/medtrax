const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medtrax');

const Shop = require('./src/models/Shop');

async function checkShopData() {
  try {
    const shops = await Shop.find({}).limit(3).select('name images ownerName ownerPhone ownerEmail services location profileComplete');
    console.log('=== CURRENT SHOP DATA IN DB ===');
    shops.forEach(shop => {
      console.log(`Shop: ${shop.name}`);
      console.log(`Images: ${JSON.stringify(shop.images)}`);
      console.log(`Owner Name: ${shop.ownerName}`);
      console.log(`Owner Phone: ${shop.ownerPhone}`);
      console.log(`Owner Email: ${shop.ownerEmail}`);
      console.log(`Services: ${JSON.stringify(shop.services)}`);
      console.log(`Location: ${JSON.stringify(shop.location)}`);
      console.log(`Profile Complete: ${shop.profileComplete}`);
      console.log('---');
    });
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkShopData();
