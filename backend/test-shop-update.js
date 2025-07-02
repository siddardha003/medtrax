const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medtrax');

const Shop = require('./src/models/Shop');

async function testShopUpdate() {
  try {
    console.log('=== TESTING SHOP UPDATE ===');
    
    // Find first shop
    const shop = await Shop.findOne({});
    if (!shop) {
      console.log('No shops found in database');
      return;
    }
    
    console.log('Testing with shop:', shop.name, '(ID:', shop._id, ')');
    
    // Test data to update
    const testData = {
      ownerName: 'Test Owner Name',
      ownerPhone: '9876543210',
      ownerEmail: 'owner@testshop.com',
      services: [
        {
          category: 'Prescription Medicines',
          items: [
            { name: 'Paracetamol 500mg', price: 25, availability: 'In Stock' },
            { name: 'Azithromycin 500mg', price: 150, availability: 'In Stock' }
          ]
        },
        {
          category: 'OTC Medicines',
          items: [
            { name: 'Vitamin C', price: 150, availability: 'In Stock' }
          ]
        }
      ],
      location: {
        type: 'Point',
        coordinates: [78.4772, 17.4065] // [longitude, latitude]
      }
    };
    
    console.log('Updating with test data:', testData);
    
    // Update the shop
    const updatedShop = await Shop.findByIdAndUpdate(
      shop._id,
      testData,
      { new: true, runValidators: true }
    );
    
    console.log('Update successful!');
    console.log('Updated shop data:');
    console.log('- Owner Name:', updatedShop.ownerName);
    console.log('- Owner Phone:', updatedShop.ownerPhone);
    console.log('- Owner Email:', updatedShop.ownerEmail);
    console.log('- Services:', updatedShop.services);
    console.log('- Location:', updatedShop.location);
    console.log('- Profile Complete:', updatedShop.profileComplete);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testShopUpdate();
