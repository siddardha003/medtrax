const {
    WeightTracker,
    HormoneTracker,
    SleepTracker,
    HeadacheTracker,
    StressTracker,
    StomachTracker
} = require('../models/HealthTracker');
const { MedicineReminder, PeriodData } = require('../models/MedicalReminder');

// Weight Tracker Controllers
const saveWeightData = async (req, res) => {
    try {
        const { weight, date, unit = 'kg' } = req.body;
        const userId = req.user.id;

        const weightEntry = new WeightTracker({
            userId,
            weight,
            date: new Date(date),
            unit
        });

        await weightEntry.save();

        res.status(201).json({
            success: true,
            message: 'Weight data saved successfully',
            data: weightEntry
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error saving weight data',
            error: error.message
        });
    }
};

const getWeightHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { limit = 50, page = 1 } = req.query;

        const weightHistory = await WeightTracker.find({ userId })
            .sort({ date: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await WeightTracker.countDocuments({ userId });

        res.status(200).json({
            success: true,
            data: weightHistory,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error fetching weight history',
            error: error.message
        });
    }
};

const getLatestWeight = async (req, res) => {
    try {
        const userId = req.user.id;

        const latestWeight = await WeightTracker.findOne({ userId })
            .sort({ date: -1 });

        res.status(200).json({
            success: true,
            data: latestWeight
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error fetching latest weight',
            error: error.message
        });
    }
};

// Hormone Tracker Controllers
const saveHormoneData = async (req, res) => {
    try {
        const { date, FSH, LH, testosterone, thyroid, prolactin, avgBloodGlucose } = req.body;
        const userId = req.user.id;

        const hormoneEntry = new HormoneTracker({
            userId,
            date: new Date(date),
            FSH,
            LH,
            testosterone,
            thyroid,
            prolactin,
            avgBloodGlucose
        });

        await hormoneEntry.save();

        res.status(201).json({
            success: true,
            message: 'Hormone data saved successfully',
            data: hormoneEntry
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error saving hormone data',
            error: error.message
        });
    }
};

const getHormoneHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { limit = 50, page = 1 } = req.query;

        const hormoneHistory = await HormoneTracker.find({ userId })
            .sort({ date: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await HormoneTracker.countDocuments({ userId });

        res.status(200).json({
            success: true,
            data: hormoneHistory,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error fetching hormone history',
            error: error.message
        });
    }
};

// Sleep Tracker Controllers
const saveSleepData = async (req, res) => {
    try {
        const { date, hoursSlept, sleepQuality = 'fair' } = req.body;
        const userId = req.user.id;

        const sleepEntry = new SleepTracker({
            userId,
            date: new Date(date),
            hoursSlept,
            sleepQuality
        });

        await sleepEntry.save();

        res.status(201).json({
            success: true,
            message: 'Sleep data saved successfully',
            data: sleepEntry
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error saving sleep data',
            error: error.message
        });
    }
};

const getSleepHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { limit = 50, page = 1 } = req.query;

        const sleepHistory = await SleepTracker.find({ userId })
            .sort({ date: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await SleepTracker.countDocuments({ userId });

        res.status(200).json({
            success: true,
            data: sleepHistory,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error fetching sleep history',
            error: error.message
        });
    }
};

// Headache Tracker Controllers
const saveHeadacheData = async (req, res) => {
    try {
        const { date, severity, duration, triggers, notes } = req.body;
        const userId = req.user.id;

        const headacheEntry = new HeadacheTracker({
            userId,
            date: new Date(date),
            severity,
            duration,
            triggers: triggers || [],
            notes
        });

        await headacheEntry.save();

        res.status(201).json({
            success: true,
            message: 'Headache data saved successfully',
            data: headacheEntry
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error saving headache data',
            error: error.message
        });
    }
};

const getHeadacheHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { limit = 50, page = 1 } = req.query;

        const headacheHistory = await HeadacheTracker.find({ userId })
            .sort({ date: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await HeadacheTracker.countDocuments({ userId });

        res.status(200).json({
            success: true,
            data: headacheHistory,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error fetching headache history',
            error: error.message
        });
    }
};

// Stress Tracker Controllers
const saveStressData = async (req, res) => {
    try {
        const { date, severity, triggers, copingMethods, notes } = req.body;
        const userId = req.user.id;

        const stressEntry = new StressTracker({
            userId,
            date: new Date(date),
            severity,
            triggers: triggers || [],
            copingMethods: copingMethods || [],
            notes
        });

        await stressEntry.save();

        res.status(201).json({
            success: true,
            message: 'Stress data saved successfully',
            data: stressEntry
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error saving stress data',
            error: error.message
        });
    }
};

const getStressHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { limit = 50, page = 1 } = req.query;

        const stressHistory = await StressTracker.find({ userId })
            .sort({ date: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await StressTracker.countDocuments({ userId });

        res.status(200).json({
            success: true,
            data: stressHistory,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error fetching stress history',
            error: error.message
        });
    }
};

// Stomach Tracker Controllers
const saveStomachData = async (req, res) => {
    try {
        const { date, severity, symptoms, triggers, notes } = req.body;
        const userId = req.user.id;

        const stomachEntry = new StomachTracker({
            userId,
            date: new Date(date),
            severity,
            symptoms: symptoms || [],
            triggers: triggers || [],
            notes
        });

        await stomachEntry.save();

        res.status(201).json({
            success: true,
            message: 'Stomach data saved successfully',
            data: stomachEntry
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error saving stomach data',
            error: error.message
        });
    }
};

const getStomachHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { limit = 50, page = 1 } = req.query;

        const stomachHistory = await StomachTracker.find({ userId })
            .sort({ date: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await StomachTracker.countDocuments({ userId });

        res.status(200).json({
            success: true,
            data: stomachHistory,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error fetching stomach history',
            error: error.message
        });
    }
};

// Medicine Reminder Controllers
const saveMedicineReminder = async (req, res) => {
    try {
        const { name, image, startDate, endDate, times, days, notes } = req.body;
        const userId = req.user.id;

        const reminder = new MedicineReminder({
            userId,
            name,
            image,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            times,
            days,
            notes
        });

        await reminder.save();

        res.status(201).json({
            success: true,
            message: 'Medicine reminder saved successfully',
            data: reminder
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error saving medicine reminder',
            error: error.message
        });
    }
};

const getMedicineReminders = async (req, res) => {
    try {
        const userId = req.user.id;
        const { active = true } = req.query;

        const reminders = await MedicineReminder.find({ 
            userId, 
            isActive: active === 'true' 
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: reminders
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error fetching medicine reminders',
            error: error.message
        });
    }
};

const deleteMedicineReminder = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const reminder = await MedicineReminder.findOneAndDelete({ 
            _id: id, 
            userId 
        });

        if (!reminder) {
            return res.status(404).json({
                success: false,
                message: 'Reminder not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Reminder deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error deleting reminder',
            error: error.message
        });
    }
};

// Period Data Controllers
const savePeriodData = async (req, res) => {
    try {
        const { lastPeriodStart, periodDuration, cycleLength } = req.body;
        const userId = req.user.id;

        // Calculate estimated dates
        const lastPeriod = new Date(lastPeriodStart);
        const estimatedOvulation = new Date(lastPeriod);
        estimatedOvulation.setDate(lastPeriod.getDate() + Math.floor(cycleLength / 2));

        const nextPeriodStart = new Date(lastPeriod);
        nextPeriodStart.setDate(lastPeriod.getDate() + cycleLength);

        const nextPeriodEnd = new Date(nextPeriodStart);
        nextPeriodEnd.setDate(nextPeriodStart.getDate() + periodDuration - 1);

        const periodData = new PeriodData({
            userId,
            lastPeriodStart: lastPeriod,
            periodDuration,
            cycleLength,
            estimatedOvulation,
            nextPeriodStart,
            nextPeriodEnd
        });

        await periodData.save();

        res.status(201).json({
            success: true,
            message: 'Period data saved successfully',
            data: periodData
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error saving period data',
            error: error.message
        });
    }
};

const getPeriodData = async (req, res) => {
    try {
        const userId = req.user.id;

        const periodData = await PeriodData.findOne({ userId })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: periodData
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error fetching period data',
            error: error.message
        });
    }
};

module.exports = {
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
    
    // Period Data
    savePeriodData,
    getPeriodData
};
