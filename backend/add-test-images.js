const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medtrax');

const Shop = require('./src/models/Shop');

async function testShopImages() {
  try {
    // Find the first shop
    const shop = await Shop.findOne({});
    if (!shop) {
      console.log('No shops found');
      process.exit(1);
    }
    
    console.log(`Found shop: ${shop.name}`);
    console.log(`Current images: ${JSON.stringify(shop.images)}`);
    
    // Add some test image URLs (mix of valid and invalid ones to test error handling)
    const testImages = [
      'https://images.unsplash.com/photo-1576671494928-a69b1af38c68?w=500', // Medical/pharmacy image
      'https://images.unsplash.com/photo-1516595080664-56e4e4d7b446?w=500', // Another medical image
      'https://invalid-url.com/nonexistent-image.jpg', // Invalid URL to test error handling
      'https://via.placeholder.com/400x300?text=Test+Pharmacy+Image' // Placeholder that should work
    ];
    
    const updatedShop = await Shop.findByIdAndUpdate(
      shop._id,
      { $set: { images: testImages } },
      { new: true }
    );
    
    console.log(`Updated shop images: ${JSON.stringify(updatedShop.images)}`);
    console.log(`Shop ID for testing: ${shop._id}`);
    console.log('✅ Test images added successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testShopImages();
