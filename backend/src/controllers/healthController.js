const {
    WeightTracker,
    HormoneTracker,
    SleepTracker,
    HeadacheTracker,
    StressTracker,
    StomachTracker
} = require('../models/HealthTracker');
const { MedicineReminder, PeriodData } = require('../models/MedicalReminder');
const PushSubscription = require('../models/PushSubscription');
const ReminderSchedule = require('../models/ReminderSchedule');

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
        const latestWeight = await WeightTracker.findOne({ userId }).sort({ date: -1, _id: -1 });
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

// Latest entry for Hormone Tracker
const getLatestHormone = async (req, res) => {
    try {
        const userId = req.user.id;
        const latest = await HormoneTracker.findOne({ userId }).sort({ date: -1, _id: -1 });
        if (!latest) {
            return res.status(404).json({ success: false, message: 'No hormone data found' });
        }
        res.status(200).json({ success: true, data: latest });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error fetching latest hormone data', error: error.message });
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

// Latest entry for Sleep Tracker
const getLatestSleep = async (req, res) => {
    try {
        const userId = req.user.id;
        const latest = await SleepTracker.findOne({ userId }).sort({ date: -1, _id: -1 });
        if (!latest) {
            return res.status(404).json({ success: false, message: 'No sleep data found' });
        }
        res.status(200).json({ success: true, data: latest });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error fetching latest sleep data', error: error.message });
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

// Latest entry for Headache Tracker
const getLatestHeadache = async (req, res) => {
    try {
        const userId = req.user.id;
        const latest = await HeadacheTracker.findOne({ userId }).sort({ date: -1, _id: -1 });
        if (!latest) {
            return res.status(404).json({ success: false, message: 'No headache data found' });
        }
        res.status(200).json({ success: true, data: latest });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error fetching latest headache data', error: error.message });
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

// Latest entry for Stress Tracker
const getLatestStress = async (req, res) => {
    try {
        const userId = req.user.id;
        const latest = await StressTracker.findOne({ userId }).sort({ date: -1, _id: -1 });
        if (!latest) {
            return res.status(404).json({ success: false, message: 'No stress data found' });
        }
        res.status(200).json({ success: true, data: latest });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error fetching latest stress data', error: error.message });
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

// Latest entry for Stomach Tracker
const getLatestStomach = async (req, res) => {
    try {
        const userId = req.user.id;
        const latest = await StomachTracker.findOne({ userId }).sort({ date: -1, _id: -1 });
        if (!latest) {
            return res.status(404).json({ success: false, message: 'No stomach data found' });
        }
        res.status(200).json({ success: true, data: latest });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error fetching latest stomach data', error: error.message });
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

        // --- Scheduling logic ---
        console.log('Attempting to schedule reminders for user:', userId);
        // Find user's push subscription
        const pushSub = await PushSubscription.findOne({ userId });
        if (pushSub) {
            console.log('Push subscription found. Proceeding to create schedules.');
            // Prepare scheduling for each date/time
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999); // Ensure the end date is inclusive

            let current = new Date(start);

            console.log(`Scheduling from ${start.toISOString()} to ${end.toISOString()}`);

            while (current <= end) {
                const dayOfWeek = current.toLocaleString('en-US', { weekday: 'short' });
                // If days are specified, only schedule for matching days
                if (!days || days.length === 0 || days.includes(dayOfWeek)) {
                    console.log(`Scheduling for day: ${dayOfWeek}`);
                    for (const timeStr of times) {
                        // Parse time string (HH:MM)
                        const [hour, minute] = timeStr.split(':').map(Number);
                        const scheduledTime = new Date(current);
                        scheduledTime.setHours(hour, minute, 0, 0);

                        console.log(`Processing time: ${timeStr}, scheduled for: ${scheduledTime.toISOString()}`);

                        // Only schedule if in the future
                        if (scheduledTime > new Date()) {
                            await ReminderSchedule.create({
                                title: name,
                                body: `Time to take your medicine: ${name}`,
                                icon: '/images/Medtrax-logo.png',
                                time: scheduledTime,
                                subscription: pushSub._id,
                                userId: userId
                            });
                            console.log(`SUCCESS: Created schedule for ${scheduledTime.toISOString()}`);
                        } else {
                            console.log(`SKIPPED: Scheduled time ${scheduledTime.toISOString()} is in the past.`);
                        }
                    }
                }
                // Move to next day
                current.setDate(current.getDate() + 1);
            }
        } else {
            console.warn(`No push subscription found for user ${userId}. Skipping reminder scheduling.`);
        }
        // --- End scheduling logic ---

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
        // Fetch all reminders for the user, regardless of status, so the frontend can sort them.
        const reminders = await MedicineReminder.find({ userId }).sort({ createdAt: -1 });

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

        // --- Delete all schedules for this reminder (any time, sent or not) ---
        const deleted = await ReminderSchedule.deleteMany({
            userId: userId,
            title: reminder.name
        });
        // --- End schedule cleanup ---

        res.status(200).json({
            success: true,
            message: 'Reminder deleted successfully',
            deletedSchedules: deleted.deletedCount
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error deleting reminder',
            error: error.message
        });
    }
};

const updateMedicineReminder = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { name, image, startDate, endDate, times, days, notes } = req.body;

        // Step 1: Find the original reminder to get the old name for cleanup
        const originalReminder = await MedicineReminder.findOne({ _id: id, userId });

        if (!originalReminder) {
            return res.status(404).json({
                success: false,
                message: 'Reminder not found'
            });
        }

        // Step 2: Delete future, unsent schedules using the ORIGINAL name
        await ReminderSchedule.deleteMany({
            userId: userId,
            title: originalReminder.name, // Use the old name for cleanup
            sent: false,
            time: { $gt: new Date() }
        });

        // Step 3: Update the reminder document with the new data
        const updatedReminder = await MedicineReminder.findByIdAndUpdate(
            id,
            { name, image, startDate: new Date(startDate), endDate: new Date(endDate), times, days, notes },
            { new: true }
        );

        // Step 4: Re-create schedules with the new info
        const pushSub = await PushSubscription.findOne({ userId });
        if (pushSub) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999); // Ensure the end date is inclusive
            let current = new Date(start);
            while (current <= end) {
                if (!days || days.length === 0 || days.includes(current.toLocaleString('en-US', { weekday: 'short' }))) {
                    for (const timeStr of times) {
                        const [hour, minute] = timeStr.split(':').map(Number);
                        const scheduledTime = new Date(current);
                        scheduledTime.setHours(hour, minute, 0, 0);
                        if (scheduledTime > new Date()) {
                            await ReminderSchedule.create({
                                title: updatedReminder.name, // Use the new name
                                body: `Time to take your medicine: ${updatedReminder.name}`,
                                icon: '/images/Medtrax-logo.png',
                                time: scheduledTime,
                                subscription: pushSub._id,
                                userId: userId
                            });
                        }
                    }
                }
                current.setDate(current.getDate() + 1);
            }
        }

        res.status(200).json({
            success: true,
            message: 'Reminder updated successfully',
            data: updatedReminder
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating reminder',
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
    getLatestHormone,
    
    // Sleep Tracker
    saveSleepData,
    getSleepHistory,
    getLatestSleep,
    
    // Headache Tracker
    saveHeadacheData,
    getHeadacheHistory,
    getLatestHeadache,
    
    // Stress Tracker
    saveStressData,
    getStressHistory,
    getLatestStress,
    
    // Stomach Tracker
    saveStomachData,
    getStomachHistory,
    getLatestStomach,
    
    // Medicine Reminder
    saveMedicineReminder,
    getMedicineReminders,
    deleteMedicineReminder,
    updateMedicineReminder,
    
    // Period Data
    savePeriodData,
    getPeriodData
};
