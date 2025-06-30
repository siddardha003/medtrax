// Utility script to activate all inactive hospitals
const mongoose = require('mongoose');
require('dotenv').config();

// Get MongoDB URI from environment
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
if (!MONGO_URI) {
  console.error('MongoDB URI not found in environment variables. Please check your .env file.');
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

// Import Hospital model
const Hospital = require('../src/models/Hospital');

const activateInactiveHospitals = async () => {
  try {
    console.log('Starting activation of inactive hospitals...');
    
    // Find all inactive hospitals or where isActive is not set
    const inactiveHospitals = await Hospital.find({
      $or: [
        { isActive: false },
        { isActive: { $exists: false } }
      ]
    });
    
    console.log(`Found ${inactiveHospitals.length} inactive or unset hospitals`);
    
    if (inactiveHospitals.length === 0) {
      console.log('No inactive hospitals to activate.');
      process.exit(0);
    }
    
    // Update all found hospitals to active
    const result = await Hospital.updateMany(
      {
        $or: [
          { isActive: false },
          { isActive: { $exists: false } }
        ]
      },
      {
        $set: { isActive: true }
      }
    );
    
    console.log(`Successfully activated ${result.modifiedCount} hospitals`);
    
    // List the activated hospitals
    console.log('\nActivated Hospitals:');
    inactiveHospitals.forEach(hospital => {
      console.log(`- ${hospital.name} (ID: ${hospital._id})`);
    });
    
    console.log('\nAll done! All hospitals are now active.');
    process.exit(0);
  } catch (error) {
    console.error('Error activating hospitals:', error);
    process.exit(1);
  }
};

// Run the function
activateInactiveHospitals();
