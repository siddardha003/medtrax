// Hospital activation utility
const Hospital = require('../models/Hospital');

const ensureAllHospitalsActive = async () => {
  try {
    
    
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
      
    } else {
      
    }
    
    return result;
  } catch (error) {
    console.error('❌ Error ensuring hospitals are active:', error);
    // Don't throw the error, just log it to prevent server startup failure
    return { error };
  }
};

module.exports = ensureAllHospitalsActive;
