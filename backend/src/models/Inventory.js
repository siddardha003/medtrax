const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: [true, 'Shop reference is required']
    },
    
    // Product Information
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [200, 'Product name cannot exceed 200 characters']
    },
    genericName: {
        type: String,
        trim: true,
        maxlength: [200, 'Generic name cannot exceed 200 characters']
    },
    brand: {
        type: String,
        trim: true,
        maxlength: [100, 'Brand name cannot exceed 100 characters']
    },
    manufacturer: {
        type: String,
        required: [true, 'Manufacturer is required'],
        trim: true,
        maxlength: [100, 'Manufacturer name cannot exceed 100 characters']
    },
    
    // Product Classification
    category: {
        type: String,
        enum: [
            'prescription_drug', 'otc_drug', 'medical_device', 'surgical_instrument',
            'health_supplement', 'baby_care', 'elderly_care', 'first_aid',
            'diagnostic_kit', 'medical_consumables', 'ayurvedic', 'homeopathic'
        ],
        required: [true, 'Product category is required']
    },
    subcategory: {
        type: String,
        trim: true
    },
    therapeuticClass: {
        type: String,
        trim: true
    },
    
    // Product Details
    description: {
        type: String,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    composition: {
        type: String,
        trim: true
    },
    strength: {
        type: String,
        trim: true
    },
    dosageForm: {
        type: String,
        enum: [
            'tablet', 'capsule', 'syrup', 'injection', 'cream', 'ointment',
            'drops', 'spray', 'inhaler', 'patch', 'powder', 'gel', 'lotion'
        ]
    },
    
    // Identification
    batchNumber: {
        type: String,
        required: [true, 'Batch number is required'],
        trim: true,
        uppercase: true
    },
    barcode: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    sku: {
        type: String,
        required: [true, 'SKU is required'],
        unique: true,
        trim: true,
        uppercase: true
    },
    hsnCode: {
        type: String,
        trim: true,
        match: [/^\d{4,8}$/, 'HSN code must be 4-8 digits']
    },
    
    // Quantity and Stock
    quantity: {
        current: {
            type: Number,
            required: [true, 'Current quantity is required'],
            min: [0, 'Quantity cannot be negative'],
            default: 0
        },
        minimum: {
            type: Number,
            required: [true, 'Minimum stock level is required'],
            min: [0, 'Minimum quantity cannot be negative'],
            default: 0
        },
        maximum: {
            type: Number,
            min: [0, 'Maximum quantity cannot be negative']
        }
    },
    unit: {
        type: String,
        enum: ['piece', 'box', 'bottle', 'strip', 'vial', 'tube', 'packet', 'kg', 'gm', 'ml', 'liter'],
        required: [true, 'Unit is required'],
        default: 'piece'
    },
    packSize: {
        type: Number,
        min: [1, 'Pack size must be at least 1'],
        default: 1
    },
    
    // Pricing
    pricing: {
        costPrice: {
            type: Number,
            required: [true, 'Cost price is required'],
            min: [0, 'Cost price cannot be negative']
        },
        sellingPrice: {
            type: Number,
            required: [true, 'Selling price is required'],
            min: [0, 'Selling price cannot be negative']
        },
        mrp: {
            type: Number,
            required: [true, 'MRP is required'],
            min: [0, 'MRP cannot be negative']
        },
        discount: {
            type: Number,
            min: [0, 'Discount cannot be negative'],
            max: [100, 'Discount cannot exceed 100%'],
            default: 0
        },
        gstRate: {
            type: Number,
            enum: [0, 5, 12, 18, 28],
            required: [true, 'GST rate is required'],
            default: 12
        }
    },
    
    // Dates
    manufacturingDate: {
        type: Date,
        required: [true, 'Manufacturing date is required']
    },
    expiryDate: {
        type: Date,
        required: [true, 'Expiry date is required'],
        validate: {
            validator: function(value) {
                return value > this.manufacturingDate;
            },
            message: 'Expiry date must be after manufacturing date'
        }
    },
    
    // Storage and Handling
    storageConditions: {
        temperature: {
            min: Number,
            max: Number,
            unit: {
                type: String,
                enum: ['celsius', 'fahrenheit'],
                default: 'celsius'
            }
        },
        humidity: {
            min: Number,
            max: Number
        },
        specialConditions: [String]
    },
    
    // Regulatory Information
    drugLicenseRequired: {
        type: Boolean,
        default: false
    },
    prescriptionRequired: {
        type: Boolean,
        default: false
    },
    scheduleType: {
        type: String,
        enum: ['H', 'H1', 'X', 'G', 'non_scheduled'],
        default: 'non_scheduled'
    },
    
    // Status and Flags
    status: {
        type: String,
        enum: ['active', 'inactive', 'discontinued', 'out_of_stock'],
        default: 'active'
    },
    isExpired: {
        type: Boolean,
        default: false
    },
    isLowStock: {
        type: Boolean,
        default: false
    },
    
    // Supplier Information
    supplier: {
        name: {
            type: String,
            required: [true, 'Supplier name is required']
        },
        contact: String,
        email: String,
        address: String
    },
    
    // Additional Information
    sideEffects: [String],
    contraindications: [String],
    interactions: [String],
    tags: [String],
    
    // Images
    images: [{
        url: String,
        alt: String,
        isPrimary: {
            type: Boolean,
            default: false
        }
    }],
    
    // Metadata
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for profit margin
inventorySchema.virtual('profitMargin').get(function() {
    if (this.pricing.costPrice && this.pricing.sellingPrice) {
        return ((this.pricing.sellingPrice - this.pricing.costPrice) / this.pricing.costPrice * 100).toFixed(2);
    }
    return 0;
});

// Virtual for days until expiry
inventorySchema.virtual('daysUntilExpiry').get(function() {
    if (this.expiryDate) {
        const now = new Date();
        const expiry = new Date(this.expiryDate);
        const diffTime = expiry - now;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return null;
});

// Virtual for stock value
inventorySchema.virtual('stockValue').get(function() {
    return (this.quantity.current * this.pricing.costPrice).toFixed(2);
});

// Indexes for better performance
inventorySchema.index({ shopId: 1 });
inventorySchema.index({ name: 1 });
inventorySchema.index({ sku: 1 });
inventorySchema.index({ barcode: 1 });
inventorySchema.index({ category: 1 });
inventorySchema.index({ status: 1 });
inventorySchema.index({ expiryDate: 1 });
inventorySchema.index({ 'quantity.current': 1 });
inventorySchema.index({ isLowStock: 1 });
inventorySchema.index({ isExpired: 1 });

// Compound indexes
inventorySchema.index({ shopId: 1, category: 1 });
inventorySchema.index({ shopId: 1, status: 1 });
inventorySchema.index({ shopId: 1, isLowStock: 1 });

// Pre-save middleware to update status flags
inventorySchema.pre('save', function(next) {
    // Check if expired
    this.isExpired = this.expiryDate < new Date();
    
    // Check if low stock
    this.isLowStock = this.quantity.current <= this.quantity.minimum;
    
    // Update status based on conditions
    if (this.isExpired) {
        this.status = 'inactive';
    } else if (this.quantity.current === 0) {
        this.status = 'out_of_stock';
    } else if (this.status === 'out_of_stock' && this.quantity.current > 0) {
        this.status = 'active';
    }
    
    next();
});

// Static method to find low stock items
inventorySchema.statics.findLowStock = function(shopId) {
    return this.find({
        shopId,
        isLowStock: true,
        status: { $ne: 'discontinued' }
    }).sort({ 'quantity.current': 1 });
};

// Static method to find expiring items
inventorySchema.statics.findExpiring = function(shopId, days = 30) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    
    return this.find({
        shopId,
        expiryDate: { $lte: futureDate, $gt: new Date() },
        status: 'active'
    }).sort({ expiryDate: 1 });
};

// Static method to search products
inventorySchema.statics.searchProducts = function(shopId, searchTerm) {
    const regex = new RegExp(searchTerm, 'i');
    return this.find({
        shopId,
        $or: [
            { name: regex },
            { genericName: regex },
            { brand: regex },
            { manufacturer: regex },
            { sku: regex }
        ],
        status: 'active'
    });
};

// Method to update stock
inventorySchema.methods.updateStock = function(quantity, operation = 'add') {
    if (operation === 'add') {
        this.quantity.current += quantity;
    } else if (operation === 'subtract') {
        this.quantity.current = Math.max(0, this.quantity.current - quantity);
    } else if (operation === 'set') {
        this.quantity.current = Math.max(0, quantity);
    }
    
    return this.save();
};

module.exports = mongoose.model('Inventory', inventorySchema);
