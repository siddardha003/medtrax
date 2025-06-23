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
        required: [true, 'License number is required'],
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
    
    // Shop details
    type: {
        type: String,
        enum: ['pharmacy', 'medical_store', 'surgical_store', 'herbal_store'],
        required: [true, 'Shop type is required'],
        default: 'pharmacy'
    },
    establishedYear: {
        type: Number,
        min: [1800, 'Established year must be after 1800'],
        max: [new Date().getFullYear(), 'Established year cannot be in the future']
    },
    
    // Operating details
    operatingHours: {
        monday: { start: String, end: String, isClosed: { type: Boolean, default: false } },
        tuesday: { start: String, end: String, isClosed: { type: Boolean, default: false } },
        wednesday: { start: String, end: String, isClosed: { type: Boolean, default: false } },
        thursday: { start: String, end: String, isClosed: { type: Boolean, default: false } },
        friday: { start: String, end: String, isClosed: { type: Boolean, default: false } },
        saturday: { start: String, end: String, isClosed: { type: Boolean, default: false } },
        sunday: { start: String, end: String, isClosed: { type: Boolean, default: true } }
    },
    
    // Services offered
    services: [{
        type: String,
        enum: [
            'prescription_dispensing', 'otc_medicines', 'medical_devices',
            'health_supplements', 'baby_care', 'elderly_care',
            'home_delivery', 'online_consultation', 'health_checkup'
        ]
    }],
    
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
        number: {
            type: String,
            required: [true, 'License number is required']
        },
        type: {
            type: String,
            enum: ['drug_license', 'pharmacy_license', 'wholesale_license'],
            required: [true, 'License type is required']
        },
        issueDate: {
            type: Date,
            required: [true, 'License issue date is required']
        },
        expiryDate: {
            type: Date,
            required: [true, 'License expiry date is required']
        },
        issuingAuthority: {
            type: String,
            required: [true, 'Issuing authority is required']
        }
    },
    
    // GST details
    gstNumber: {
        type: String,
        trim: true,
        uppercase: true,
        match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GST number format']
    },
    
    // Owner/Contact person
    owner: {
        name: {
            type: String,
            required: [true, 'Owner name is required']
        },
        qualification: String,
        phone: String,
        email: String,
        pharmacistLicense: String
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
    
    // Payment methods accepted
    paymentMethods: [{
        type: String,
        enum: ['cash', 'card', 'upi', 'net_banking', 'digital_wallet']
    }],
    
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
shopSchema.virtual('fullAddress').get(function() {
    const addr = this.address;
    return `${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}, ${addr.country}`;
});

// Virtual for inventory count
shopSchema.virtual('inventoryCount', {
    ref: 'Inventory',
    localField: '_id',
    foreignField: 'shopId',
    count: true
});

// Virtual for orders count
shopSchema.virtual('ordersCount', {
    ref: 'Order',
    localField: '_id',
    foreignField: 'shopId',
    count: true
});

// Indexes for better performance (name, licenseNumber, email already have unique indexes)
shopSchema.index({ 'address.city': 1 });
shopSchema.index({ 'address.state': 1 });
shopSchema.index({ type: 1 });
shopSchema.index({ isActive: 1 });
shopSchema.index({ isVerified: 1 });
shopSchema.index({ gstNumber: 1 });

// Static method to find shops by location
shopSchema.statics.findByLocation = function(city, state) {
    return this.find({
        'address.city': new RegExp(city, 'i'),
        'address.state': new RegExp(state, 'i'),
        isActive: true,
        isVerified: true
    });
};

// Static method to find shops by service
shopSchema.statics.findByService = function(service) {
    return this.find({
        services: service,
        isActive: true,
        isVerified: true
    });
};

// Method to check if license is valid
shopSchema.methods.isLicenseValid = function() {
    return this.license.expiryDate > new Date();
};

module.exports = mongoose.model('Shop', shopSchema);
