const mongoose = require('mongoose');

// Weight Tracker Schema
const weightTrackerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    weight: {
        type: Number,
        required: [true, 'Weight is required'],
        min: [0, 'Weight must be positive']
    },
    date: {
        type: Date,
        required: [true, 'Date is required']
    },
    unit: {
        type: String,
        enum: ['kg', 'lbs'],
        default: 'kg'
    }
}, {
    timestamps: true
});

// Hormone Tracker Schema
const hormoneTrackerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: [true, 'Date is required']
    },
    FSH: {
        type: Number,
        min: 0
    },
    LH: {
        type: Number,
        min: 0
    },
    testosterone: {
        type: Number,
        min: 0
    },
    thyroid: {
        type: Number,
        min: 0
    },
    prolactin: {
        type: Number,
        min: 0
    },
    avgBloodGlucose: {
        type: Number,
        min: 0
    }
}, {
    timestamps: true
});

// Sleep Tracker Schema
const sleepTrackerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: [true, 'Date is required']
    },
    hoursSlept: {
        type: Number,
        required: [true, 'Hours slept is required'],
        min: [0, 'Hours must be positive'],
        max: [24, 'Hours cannot exceed 24']
    },
    sleepQuality: {
        type: String,
        enum: ['poor', 'fair', 'good', 'excellent'],
        default: 'fair'
    }
}, {
    timestamps: true
});

// Headache Tracker Schema
const headacheTrackerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: [true, 'Date is required']
    },
    severity: {
        type: String,
        enum: ['mild', 'moderate', 'severe'],
        required: [true, 'Severity is required']
    },
    duration: {
        type: Number, // in hours
        min: 0
    },
    triggers: [{
        type: String
    }],
    notes: {
        type: String,
        maxlength: 500
    }
}, {
    timestamps: true
});

// Stress Tracker Schema
const stressTrackerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: [true, 'Date is required']
    },
    severity: {
        type: String,
        enum: ['mild', 'moderate', 'severe'],
        required: [true, 'Severity is required']
    },
    triggers: [{
        type: String
    }],
    copingMethods: [{
        type: String
    }],
    notes: {
        type: String,
        maxlength: 500
    }
}, {
    timestamps: true
});

// Stomach Issues Tracker Schema
const stomachTrackerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: [true, 'Date is required']
    },
    severity: {
        type: String,
        enum: ['mild', 'moderate', 'severe'],
        required: [true, 'Severity is required']
    },
    symptoms: [{
        type: String,
        enum: ['nausea', 'vomiting', 'pain', 'bloating', 'cramps', 'indigestion', 'other']
    }],
    triggers: [{
        type: String
    }],
    notes: {
        type: String,
        maxlength: 500
    }
}, {
    timestamps: true
});

// Add indexes for better query performance
weightTrackerSchema.index({ userId: 1, date: -1 });
hormoneTrackerSchema.index({ userId: 1, date: -1 });
sleepTrackerSchema.index({ userId: 1, date: -1 });
headacheTrackerSchema.index({ userId: 1, date: -1 });
stressTrackerSchema.index({ userId: 1, date: -1 });
stomachTrackerSchema.index({ userId: 1, date: -1 });

module.exports = {
    WeightTracker: mongoose.model('WeightTracker', weightTrackerSchema),
    HormoneTracker: mongoose.model('HormoneTracker', hormoneTrackerSchema),
    SleepTracker: mongoose.model('SleepTracker', sleepTrackerSchema),
    HeadacheTracker: mongoose.model('HeadacheTracker', headacheTrackerSchema),
    StressTracker: mongoose.model('StressTracker', stressTrackerSchema),
    StomachTracker: mongoose.model('StomachTracker', stomachTrackerSchema)
};
