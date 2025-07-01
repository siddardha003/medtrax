const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Shop name is required'],
        trim: true,
        maxlength: [100, 'Shop name cannot exceed 100 characters']
    },
    licenseNumber: {
        type: String,
        unique: true,
        trim: true
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
    // Additional profile fields
    closingTime: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    directionsLink: {
        type: String,
        trim: true
    },
    images: [{
        type: String,
        trim: true
    }],
    services: [{
        category: {
            type: String,
            required: true,
            trim: true
        },
        items: [{
            name: {
                type: String,
                required: true,
                trim: true
            },
            price: {
                type: Number,
                min: 0
            },
            availability: {
                type: String,
                enum: ['In Stock', 'Limited Stock', 'Out of Stock', 'Available', '24/7 Available'],
                default: 'In Stock'
            }
        }]
    }],
    openingTimes: [{
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
    }],
    selectedMedicalshop: {
        name: {
            type: String,
            trim: true
        },
        latitude: {
            type: Number
        },
        longitude: {
            type: Number
        }
    },
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

module.exports = mongoose.model('Shop', shopSchema);
