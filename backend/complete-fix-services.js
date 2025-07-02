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

const completelyFixServices = async () => {
  try {
    await connectDB();
    
    console.log('=== COMPLETELY FIXING ALL SHOP SERVICES ===\n');
    
    // Find all shops
    const shops = await Shop.find({});
    
    for (const shop of shops) {
      console.log(`Processing ${shop.name}...`);
      
      let needsUpdate = false;
      
      // Check if services are corrupted (has numeric keys like '0', '1', '2'...)
      if (shop.services && shop.services.length > 0) {
        const firstService = shop.services[0];
        if (firstService && (firstService['0'] || firstService.hasOwnProperty('0'))) {
          console.log(`  🔧 Services are corrupted, fixing...`);
          needsUpdate = true;
        } else if (!firstService.category || !Array.isArray(firstService.items)) {
          console.log(`  🔧 Services format is incorrect, fixing...`);
          needsUpdate = true;
        }
      } else {
        console.log(`  🔧 No services found, adding...`);
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        // Create proper services based on shop name
        let newServices = [];
        
        switch (shop.name) {
          case 'Apollo Pharmacy':
            newServices = [
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
              }
            ];
            break;
            
          case 'MedPlus Pharmacy':
            newServices = [
              {
                category: 'Prescription Medicines',
                items: [
                  { name: 'Crocin 650mg', price: 30, availability: 'In Stock' },
                  { name: 'Dolo 500mg', price: 20, availability: 'In Stock' }
                ]
              },
              {
                category: 'OTC Medicines',
                items: [
                  { name: 'Cough Syrup', price: 120, availability: 'In Stock' },
                  { name: 'Antiseptic Cream', price: 80, availability: 'In Stock' }
                ]
              },
              {
                category: 'Health Supplements',
                items: [
                  { name: 'Multivitamin', price: 350, availability: 'In Stock' }
                ]
              }
            ];
            break;
            
          case 'Guardian Pharmacy':
            newServices = [
              {
                category: 'Prescription Medicines',
                items: [
                  { name: 'Panadol 500mg', price: 35, availability: 'In Stock' },
                  { name: 'Augmentin 625mg', price: 180, availability: 'In Stock' }
                ]
              },
              {
                category: 'OTC Medicines',
                items: [
                  { name: 'Band-Aid', price: 50, availability: 'In Stock' },
                  { name: 'Thermometer', price: 250, availability: 'In Stock' }
                ]
              },
              {
                category: 'Medical Devices',
                items: [
                  { name: 'Digital BP Monitor', price: 1500, availability: 'In Stock' }
                ]
              }
            ];
            break;
            
          default:
            newServices = [
              {
                category: 'Prescription Medicines',
                items: [
                  { name: 'Paracetamol 500mg', price: 25, availability: 'In Stock' },
                  { name: 'Basic Antibiotics', price: 120, availability: 'In Stock' }
                ]
              },
              {
                category: 'OTC Medicines',
                items: [
                  { name: 'Pain Relief Gel', price: 80, availability: 'In Stock' },
                  { name: 'First Aid Kit', price: 200, availability: 'In Stock' }
                ]
              }
            ];
        }
        
        // Use direct MongoDB update to bypass validation issues
        await Shop.updateOne(
          { _id: shop._id },
          { 
            $set: { 
              services: newServices,
              profileComplete: true
            } 
          }
        );
        
        console.log(`  ✅ ${shop.name} services updated successfully`);
      } else {
        console.log(`  ✅ ${shop.name} services are already correct`);
      }
    }
    
    console.log('\n=== VERIFICATION ===');
    const updatedShops = await Shop.find({}).select('name services ownerName location profileComplete');
    
    for (const shop of updatedShops) {
      console.log(`\n${shop.name}:`);
      console.log(`  Owner: ${shop.ownerName || 'Not set'}`);
      console.log(`  Location: ${shop.location?.coordinates ? shop.location.coordinates.join(', ') : 'Not set'}`);
      console.log(`  Services: ${shop.services?.length || 0} categories`);
      
      if (shop.services && shop.services.length > 0) {
        shop.services.forEach((service, index) => {
          if (service.category) {
            console.log(`    ${index + 1}. ${service.category} (${service.items?.length || 0} items)`);
          } else {
            console.log(`    ${index + 1}. CORRUPTED SERVICE:`, Object.keys(service).slice(0, 5));
          }
        });
      }
      
      console.log(`  Profile Complete: ${shop.profileComplete}`);
    }
    
    console.log('\n=== SHOP SERVICES COMPLETELY FIXED ===');
    process.exit(0);
    
  } catch (error) {
    console.error('Error fixing services:', error);
    process.exit(1);
  }
};

completelyFixServices();
