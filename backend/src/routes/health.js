const express = require('express');
const router = express.Router();
const {
    // Weight Tracker
    saveWeightData,
    getWeightHistory,
    getLatestWeight,
    
    // Hormone Tracker
    saveHormoneData,
    getHormoneHistory,
    
    // Sleep Tracker
    saveSleepData,
    getSleepHistory,
    
    // Headache Tracker
    saveHeadacheData,
    getHeadacheHistory,
    
    // Stress Tracker
    saveStressData,
    getStressHistory,
    
    // Stomach Tracker
    saveStomachData,
    getStomachHistory,
    
    // Medicine Reminder
    saveMedicineReminder,
    getMedicineReminders,
    deleteMedicineReminder,
    updateMedicineReminder,
    
    // Period Data
    savePeriodData,
    getPeriodData
} = require('../controllers/healthController');

const { protect } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(protect);

// Weight Tracker Routes
router.post('/weight', saveWeightData);
router.get('/weight/history', getWeightHistory);
router.get('/weight/latest', getLatestWeight);

// Hormone Tracker Routes
router.post('/hormone', saveHormoneData);
router.get('/hormone/history', getHormoneHistory);

// Sleep Tracker Routes
router.post('/sleep', saveSleepData);
router.get('/sleep/history', getSleepHistory);

// Headache Tracker Routes
router.post('/headache', saveHeadacheData);
router.get('/headache/history', getHeadacheHistory);

// Stress Tracker Routes
router.post('/stress', saveStressData);
router.get('/stress/history', getStressHistory);

// Stomach Tracker Routes
router.post('/stomach', saveStomachData);
router.get('/stomach/history', getStomachHistory);

// Medicine Reminder Routes
router.post('/reminder', saveMedicineReminder);
router.get('/reminder', getMedicineReminders);
router.delete('/reminder/:id', deleteMedicineReminder);
router.put('/reminder/:id', updateMedicineReminder);

// Period Data Routes
router.post('/period', savePeriodData);
router.get('/period', getPeriodData);

module.exports = router;
