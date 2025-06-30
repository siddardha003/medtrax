const mongoose = require('mongoose');

// Define doctor schema for hospital departments
const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    degree: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        default: 'https://via.placeholder.com/150'
    }
}, { _id: true });

// Define department/service schema
const serviceSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        default: 'https://via.placeholder.com/150'
    },
    doctors: [doctorSchema]
}, { _id: true });

// Define opening time schema
const openingTimeSchema = new mongoose.Schema({
    day: {
        type: String,
        required: true,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    time: {
        type: String,
        required: true,
        trim: true
    }
}, { _id: false });

const hospitalSchema = new mongoose.Schema({
    // Basic information (created by Super Admin)
    name: {
        type: String,
        required: [true, 'Hospital name is required'],
        trim: true,
        maxlength: [100, 'Hospital name cannot exceed 100 characters']
    },
    registrationNumber: {
        type: String,
        default: null,
        index: { 
            unique: true,
            partialFilterExpression: { registrationNumber: { $type: 'string' } }
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true
    },
    pincode: {
        type: String,
        required: [true, 'Pincode is required'],
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
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true
    },
    
    // Additional profile information (updated by Hospital Admin)
    profileComplete: {
        type: Boolean,
        default: false
    },
    images: {
        type: [String],
        default: []
    },
    closingTime: {
        type: String,
        default: "10:00 PM"
    },
    openingTimes: {
        type: [openingTimeSchema],
        default: []
    },
    services: {
        type: [serviceSchema],
        default: []
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviewsCount: {
        type: Number,
        default: 0
    },
    location: {
        latitude: {
            type: Number,
            default: null
        },
        longitude: {
            type: Number,
            default: null
        }
    },
    
    // Reference information
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
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
    timestamps: true
});

module.exports = mongoose.model('Hospital', hospitalSchema);
