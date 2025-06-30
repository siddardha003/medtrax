// Hospital activation utility
const Hospital = require('../models/Hospital');

const ensureAllHospitalsActive = async () => {
  try {
    console.log('🏥 Checking for inactive hospitals on server startup...');
    
    // Find all inactive hospitals or where isActive is not set
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
    
    if (result.modifiedCount > 0) {
      console.log(`✅ Activated ${result.modifiedCount} previously inactive hospitals`);
    } else {
      console.log('✅ All hospitals are already active');
    }
    
    return result;
  } catch (error) {
    console.error('❌ Error ensuring hospitals are active:', error);
    // Don't throw the error, just log it to prevent server startup failure
    return { error };
  }
};

module.exports = ensureAllHospitalsActive;
