const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Hospital name is required'],
        trim: true,
        maxlength: [100, 'Hospital name cannot exceed 100 characters']
    },
    registrationNumber: {
        type: String,
        required: [true, 'Registration number is required'],
        unique: true,
        trim: true,
        uppercase: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please enter a valid email'
        ]
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
    },
    address: {
        street: {
            type: String,
            required: [true, 'Street address is required'],
            trim: true
        },
        city: {
            type: String,
            required: [true, 'City is required'],
            trim: true
        },
        state: {
            type: String,
            required: [true, 'State is required'],
            trim: true
        },
        zipCode: {
            type: String,
            required: [true, 'ZIP code is required'],
            trim: true
        },
        country: {
            type: String,
            required: [true, 'Country is required'],
            trim: true,
            default: 'India'
        }
    },
    // Hospital details
    type: {
        type: String,
        enum: ['general', 'specialty', 'multispecialty', 'clinic', 'nursing_home'],
        required: [true, 'Hospital type is required']
    },
    establishedYear: {
        type: Number,
        min: [1800, 'Established year must be after 1800'],
        max: [new Date().getFullYear(), 'Established year cannot be in the future']
    },
    bedCapacity: {
        type: Number,
        min: [1, 'Bed capacity must be at least 1'],
        default: 1
    },
    departments: [{
        type: String,
        enum: [
            'cardiology', 'neurology', 'orthopedics', 'pediatrics', 
            'gynecology', 'dermatology', 'psychiatry', 'radiology',
            'pathology', 'emergency', 'icu', 'general_medicine',
            'general_surgery', 'dentistry', 'ophthalmology', 'ent'
        ]
    }],
    
    // Operational details
    operatingHours: {
        monday: { start: String, end: String, is24Hours: { type: Boolean, default: false } },
        tuesday: { start: String, end: String, is24Hours: { type: Boolean, default: false } },
        wednesday: { start: String, end: String, is24Hours: { type: Boolean, default: false } },
        thursday: { start: String, end: String, is24Hours: { type: Boolean, default: false } },
        friday: { start: String, end: String, is24Hours: { type: Boolean, default: false } },
        saturday: { start: String, end: String, is24Hours: { type: Boolean, default: false } },
        sunday: { start: String, end: String, is24Hours: { type: Boolean, default: false } }
    },
    
    // Status and verification
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationDate: {
        type: Date,
        default: null
    },
    
    // License and certification
    license: {
        number: String,
        issueDate: Date,
        expiryDate: Date,
        issuingAuthority: String
    },
    
    // Contact person
    contactPerson: {
        name: {
            type: String,
            required: [true, 'Contact person name is required']
        },
        designation: String,
        phone: String,
        email: String
    },
    
    // Additional information
    website: {
        type: String,
        match: [/^https?:\/\/.+/, 'Please enter a valid website URL']
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    
    // Admin user reference
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    
    // Metadata
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for full address
hospitalSchema.virtual('fullAddress').get(function() {
    const addr = this.address;
    return `${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}, ${addr.country}`;
});

// Virtual for appointments count
hospitalSchema.virtual('appointmentsCount', {
    ref: 'Appointment',
    localField: '_id',
    foreignField: 'hospitalId',
    count: true
});

// Indexes for better performance
hospitalSchema.index({ name: 1 });
hospitalSchema.index({ registrationNumber: 1 });
hospitalSchema.index({ email: 1 });
hospitalSchema.index({ 'address.city': 1 });
hospitalSchema.index({ 'address.state': 1 });
hospitalSchema.index({ type: 1 });
hospitalSchema.index({ isActive: 1 });
hospitalSchema.index({ isVerified: 1 });

// Static method to find hospitals by location
hospitalSchema.statics.findByLocation = function(city, state) {
    return this.find({
        'address.city': new RegExp(city, 'i'),
        'address.state': new RegExp(state, 'i'),
        isActive: true,
        isVerified: true
    });
};

// Static method to find hospitals by department
hospitalSchema.statics.findByDepartment = function(department) {
    return this.find({
        departments: department,
        isActive: true,
        isVerified: true
    });
};

module.exports = mongoose.model('Hospital', hospitalSchema);
