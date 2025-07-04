const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medtrax', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Shop = require('./src/models/Shop');

async function checkShopImages() {
  try {
    const shops = await Shop.find({}).limit(5).select('name images');
    
 
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkShopImages();
