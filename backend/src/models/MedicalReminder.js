const mongoose = require('mongoose');

// Medicine Reminder Schema
const medicineReminderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Medicine name is required'],
        trim: true,
        maxlength: 100
    },
    image: {
        type: String, // Store image URL/path
        default: null
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required']
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required']
    },
    times: [{
        type: String, // Store time in HH:MM format
        required: true
    }],
    days: [{
        type: String,
        enum: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    }],
    status: {
        type: String,
        enum: ['active', 'completed'],
        default: 'active'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    notes: {
        type: String,
        maxlength: 500
    }
}, {
    timestamps: true
});

// Period Calculator Data Schema
const periodDataSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lastPeriodStart: {
        type: Date,
        required: [true, 'Last period start date is required']
    },
    periodDuration: {
        type: Number,
        required: [true, 'Period duration is required'],
        min: 1,
        max: 10,
        default: 5
    },
    cycleLength: {
        type: Number,
        required: [true, 'Cycle length is required'],
        min: 20,
        max: 45,
        default: 28
    },
    // Calculated fields
    estimatedOvulation: {
        type: Date
    },
    nextPeriodStart: {
        type: Date
    },
    nextPeriodEnd: {
        type: Date
    }
}, {
    timestamps: true
});

// Add indexes
medicineReminderSchema.index({ userId: 1, startDate: 1 });
medicineReminderSchema.index({ userId: 1, isActive: 1 });
periodDataSchema.index({ userId: 1, lastPeriodStart: -1 });

module.exports = {
    MedicineReminder: mongoose.model('MedicineReminder', medicineReminderSchema),
    PeriodData: mongoose.model('PeriodData', periodDataSchema)
};
