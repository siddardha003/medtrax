const mongoose = require('mongoose');
const Shop = require('./src/models/Shop');

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medtrax', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const fixCorruptedShopData = async () => {
  try {
    await connectDB();
    
    // Find shops with corrupted services data
    const shops = await Shop.find({});
    
    console.log('=== FIXING CORRUPTED SHOP DATA ===\n');
    
    for (const shop of shops) {
      console.log(`Processing shop: ${shop.name}`);
      
      let needsUpdate = false;
      const updates = {};
      
      // Check if services are corrupted (stored as character arrays)
      if (shop.services && shop.services.length > 0) {
        const firstService = shop.services[0];
        // If the service has numeric keys (0, 1, 2...), it's corrupted
        if (firstService && typeof firstService === 'object' && firstService['0']) {
          console.log(`  - Services are corrupted (character array format)`);
          
          // Create proper services structure
          const defaultServices = [
            {
              category: 'Prescription Medicines',
              items: [
                { name: 'Paracetamol 500mg', price: 25, availability: 'In Stock' },
                { name: 'Azithromycin 500mg', price: 150, availability: 'In Stock' },
                { name: 'Amoxicillin 250mg', price: 120, availability: 'In Stock' }
              ]
            },
            {
              category: 'OTC Medicines',
              items: [
                { name: 'Vitamin C', price: 150, availability: 'In Stock' },
                { name: 'Paracetamol Syrup', price: 85, availability: 'In Stock' }
              ]
            },
            {
              category: 'Health Supplements',
              items: [
                { name: 'Multivitamin Tablets', price: 350, availability: 'In Stock' },
                { name: 'Calcium Tablets', price: 200, availability: 'In Stock' }
              ]
            }
          ];
          
          updates.services = defaultServices;
          needsUpdate = true;
        }
      } else {
        console.log(`  - No services found, adding default services`);
        updates.services = [
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
        ];
        needsUpdate = true;
      }
      
      // Check if location coordinates are missing
      if (!shop.location || !shop.location.coordinates || shop.location.coordinates.length !== 2) {
        console.log(`  - Location coordinates missing, adding default location`);
        // Default locations for different shops
        const defaultLocations = {
          'MedPlus Pharmacy': [78.4867, 17.3850], // Different area in Hyderabad
          'Guardian Pharmacy': [78.4744, 17.4399], // Another area in Hyderabad
          'default': [78.4772, 17.4065] // Default Hyderabad coordinates
        };
        
        const coords = defaultLocations[shop.name] || defaultLocations['default'];
        updates.location = {
          type: 'Point',
          coordinates: coords
        };
        needsUpdate = true;
      }
      
      // Check if owner information is missing
      if (!shop.ownerName || !shop.ownerPhone || !shop.ownerEmail) {
        console.log(`  - Owner information missing, adding sample owner data`);
        
        // Different owner data for different shops
        const ownerData = {
          'MedPlus Pharmacy': {
            ownerName: 'Rajesh Kumar',
            ownerPhone: '9876543211',
            ownerEmail: 'rajesh@medplus.com'
          },
          'Guardian Pharmacy': {
            ownerName: 'Priya Sharma',
            ownerPhone: '9876543212',
            ownerEmail: 'priya@guardian.com'
          }
        };
        
        const owner = ownerData[shop.name] || {
          ownerName: `${shop.name} Owner`,
          ownerPhone: '9876543210',
          ownerEmail: `owner@${shop.name.toLowerCase().replace(/\s+/g, '')}.com`
        };
        
        Object.assign(updates, owner);
        needsUpdate = true;
      }
      
      // Add some default images if none exist
      if (!shop.images || shop.images.length === 0) {
        console.log(`  - No images found, adding default images`);
        updates.images = [
          'https://images.unsplash.com/photo-1576671494928-a69b1af38c68?w=500',
          'https://images.unsplash.com/photo-1516595080664-56e4e4d7b446?w=500'
        ];
        needsUpdate = true;
      }
      
      // Update profileComplete status
      updates.profileComplete = true;
      needsUpdate = true;
      
      if (needsUpdate) {
        console.log(`  - Updating shop with fixes...`);
        await Shop.findByIdAndUpdate(shop._id, updates, { new: true });
        console.log(`  ✅ ${shop.name} updated successfully\n`);
      } else {
        console.log(`  ✅ ${shop.name} data is already correct\n`);
      }
    }
    
    console.log('=== VERIFICATION ===');
    const updatedShops = await Shop.find({}).select('name services ownerName ownerPhone ownerEmail location profileComplete images');
    
    for (const shop of updatedShops) {
      console.log(`\nShop: ${shop.name}`);
      console.log(`Owner: ${shop.ownerName} (${shop.ownerPhone})`);
      console.log(`Location: ${shop.location?.coordinates || 'No coordinates'}`);
      console.log(`Services: ${shop.services?.length || 0} categories`);
      console.log(`Images: ${shop.images?.length || 0} images`);
      console.log(`Profile Complete: ${shop.profileComplete}`);
    }
    
    console.log('\n=== SHOP DATA FIXING COMPLETE ===');
    process.exit(0);
    
  } catch (error) {
    console.error('Error fixing shop data:', error);
    process.exit(1);
  }
};

fixCorruptedShopData();
