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

const updateShopsWithStockInfo = async () => {
  try {
    await connectDB();
    
    console.log('=== UPDATING SHOPS WITH STOCK INFORMATION ===\n');
    
    // Update Apollo Pharmacy with stock info
    await Shop.updateOne(
      { name: 'Apollo Pharmacy' },
      { 
        $set: { 
          services: [
            {
              category: 'Prescription Medicines',
              items: [
                { 
                  name: 'Paracetamol 500mg', 
                  price: 25, 
                  availability: 'In Stock',
                  stockCount: 150,
                  expiryDate: new Date('2025-12-31'),
                  brand: 'Apollo',
                  description: 'Pain relief and fever reducer'
                },
                { 
                  name: 'Azithromycin 500mg', 
                  price: 150, 
                  availability: 'In Stock',
                  stockCount: 75,
                  expiryDate: new Date('2025-09-15'),
                  brand: 'Apollo',
                  description: 'Antibiotic for bacterial infections'
                },
                { 
                  name: 'Amoxicillin 250mg', 
                  price: 120, 
                  availability: 'Limited Stock',
                  stockCount: 25,
                  expiryDate: new Date('2025-08-20'),
                  brand: 'Apollo',
                  description: 'Antibiotic capsules'
                }
              ]
            },
            {
              category: 'OTC Medicines',
              items: [
                { 
                  name: 'Vitamin C 500mg', 
                  price: 150, 
                  availability: 'In Stock',
                  stockCount: 200,
                  expiryDate: new Date('2026-03-15'),
                  brand: 'Apollo',
                  description: 'Immune system support'
                },
                { 
                  name: 'Paracetamol Syrup', 
                  price: 85, 
                  availability: 'In Stock',
                  stockCount: 100,
                  expiryDate: new Date('2025-11-30'),
                  brand: 'Apollo',
                  description: 'Liquid pain relief for children'
                }
              ]
            }
          ]
        } 
      }
    );

    // Update MedPlus Pharmacy with stock info
    await Shop.updateOne(
      { name: 'MedPlus Pharmacy' },
      { 
        $set: { 
          services: [
            {
              category: 'Prescription Medicines',
              items: [
                { 
                  name: 'Crocin 650mg', 
                  price: 30, 
                  availability: 'In Stock',
                  stockCount: 120,
                  expiryDate: new Date('2025-10-25'),
                  brand: 'GSK',
                  description: 'Advanced pain relief tablets'
                },
                { 
                  name: 'Dolo 500mg', 
                  price: 20, 
                  availability: 'In Stock',
                  stockCount: 90,
                  expiryDate: new Date('2025-09-10'),
                  brand: 'Micro Labs',
                  description: 'Fever and pain relief'
                }
              ]
            },
            {
              category: 'OTC Medicines',
              items: [
                { 
                  name: 'Cough Syrup', 
                  price: 120, 
                  availability: 'In Stock',
                  stockCount: 60,
                  expiryDate: new Date('2025-12-15'),
                  brand: 'Dabur',
                  description: 'Natural cough relief syrup'
                },
                { 
                  name: 'Antiseptic Cream', 
                  price: 80, 
                  availability: 'Limited Stock',
                  stockCount: 15,
                  expiryDate: new Date('2025-08-30'),
                  brand: 'Boroline',
                  description: 'Antiseptic and healing cream'
                }
              ]
            },
            {
              category: 'Health Supplements',
              items: [
                { 
                  name: 'Multivitamin Tablets', 
                  price: 350, 
                  availability: 'In Stock',
                  stockCount: 80,
                  expiryDate: new Date('2026-01-20'),
                  brand: 'Centrum',
                  description: 'Complete daily nutrition'
                }
              ]
            }
          ]
        } 
      }
    );

    // Update Guardian Pharmacy with stock info
    await Shop.updateOne(
      { name: 'Guardian Pharmacy' },
      { 
        $set: { 
          services: [
            {
              category: 'Prescription Medicines',
              items: [
                { 
                  name: 'Panadol 500mg', 
                  price: 35, 
                  availability: 'In Stock',
                  stockCount: 110,
                  expiryDate: new Date('2025-11-10'),
                  brand: 'GSK',
                  description: 'Trusted pain relief'
                },
                { 
                  name: 'Augmentin 625mg', 
                  price: 180, 
                  availability: 'Limited Stock',
                  stockCount: 30,
                  expiryDate: new Date('2025-09-05'),
                  brand: 'GSK',
                  description: 'Broad spectrum antibiotic'
                }
              ]
            },
            {
              category: 'OTC Medicines',
              items: [
                { 
                  name: 'Band-Aid Strips', 
                  price: 50, 
                  availability: 'In Stock',
                  stockCount: 200,
                  expiryDate: new Date('2027-12-31'),
                  brand: 'Johnson & Johnson',
                  description: 'Adhesive bandages'
                },
                { 
                  name: 'Digital Thermometer', 
                  price: 250, 
                  availability: 'In Stock',
                  stockCount: 25,
                  brand: 'Omron',
                  description: 'Accurate temperature measurement'
                }
              ]
            },
            {
              category: 'Medical Devices',
              items: [
                { 
                  name: 'Digital BP Monitor', 
                  price: 1500, 
                  availability: 'In Stock',
                  stockCount: 12,
                  brand: 'Omron',
                  description: 'Automatic blood pressure monitor'
                }
              ]
            }
          ]
        } 
      }
    );

    console.log('✅ All shops updated with stock information');
    
    // Verify updates
    const shops = await Shop.find({}).select('name services');
    for (const shop of shops) {
      console.log(`\n${shop.name}:`);
      if (shop.services && shop.services.length > 0) {
        shop.services.forEach((service) => {
          console.log(`  ${service.category}:`);
          service.items?.forEach((item) => {
            console.log(`    - ${item.name}: ₹${item.price} | ${item.availability} | Stock: ${item.stockCount || 'N/A'}`);
          });
        });
      }
    }
    
    console.log('\n=== STOCK INFO UPDATE COMPLETE ===');
    process.exit(0);
    
  } catch (error) {
    console.error('Error updating stock info:', error);
    process.exit(1);
  }
};

updateShopsWithStockInfo();
