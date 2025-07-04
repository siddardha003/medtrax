// Script to test service item image support
require('dotenv').config();
const mongoose = require('mongoose');
const Shop = require('./src/models/Shop');

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const testServiceItemImages = async () => {
    try {
        await connectDB();
        
        // Find a shop to modify
        const shops = await Shop.find().limit(2);
        
        if (!shops || shops.length === 0) {
            
            return;
        }
        
        const shop = shops[0];
        
        
        // Check if the shop has services
        
        
        // Add a test service with an image
        const testServiceItem = {
            category: 'Test Service',
            items: [
                {
                    name: 'Test Item with Image',
                    price: 100,
                    availability: 'In Stock',
                    stockCount: 10,
                    image: 'https://via.placeholder.com/150?text=Test+Service+Image',
                    description: 'This is a test item with an image'
                }
            ]
        };
        
        // Update or add the test service
        let serviceUpdated = false;
        
        if (shop.services && shop.services.length > 0) {
            // Check if 'Test Service' category already exists
            const testServiceIndex = shop.services.findIndex(s => s.category === 'Test Service');
            
            if (testServiceIndex >= 0) {
                
                shop.services[testServiceIndex] = testServiceItem;
                serviceUpdated = true;
            }
        }
        
        if (!serviceUpdated) {
            
            shop.services = shop.services || [];
            shop.services.push(testServiceItem);
        }
        
        // Save the updated shop
        await shop.save();
        
        
            
        
        // Verify the image field is saved correctly
        const updatedShop = await Shop.findById(shop._id);
        const testService = updatedShop.services.find(s => s.category === 'Test Service');
        
        if (testService && testService.items && testService.items.length > 0) {
            
        }
        
        
    } catch (error) {
        console.error('Error testing service item images:', error);
    } finally {
        // Disconnect from MongoDB
        mongoose.disconnect();
        
    }
};

testServiceItemImages();
