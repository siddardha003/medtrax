const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: [true, 'Shop reference is required']
    },
    
    // Order Information
    orderNumber: {
        type: String,
        unique: true,
        required: [true, 'Order number is required'],
        uppercase: true
    },
    invoiceNumber: {
        type: String,
        unique: true,
        uppercase: true
    },
    
    // Customer Information
    customer: {
        type: {
            type: String,
            enum: ['walk_in', 'registered', 'hospital', 'institution'],
            default: 'walk_in'
        },
        firstName: {
            type: String,
            required: [true, 'Customer first name is required'],
            trim: true
        },
        lastName: {
            type: String,
            required: [true, 'Customer last name is required'],
            trim: true
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please enter a valid email'
            ]
        },
        phone: {
            type: String,
            required: [true, 'Customer phone is required'],
            trim: true,
            match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
        },
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: { type: String, default: 'India' }
        },
        gstNumber: {
            type: String,
            trim: true,
            uppercase: true,
            match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GST number format']
        }
    },
    
    // Order Items
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Inventory',
            required: [true, 'Product reference is required']
        },
        name: {
            type: String,
            required: [true, 'Product name is required']
        },
        sku: {
            type: String,
            required: [true, 'Product SKU is required']
        },
        batchNumber: {
            type: String,
            required: [true, 'Batch number is required']
        },
        quantity: {
            type: Number,
            required: [true, 'Quantity is required'],
            min: [1, 'Quantity must be at least 1']
        },
        unit: {
            type: String,
            required: [true, 'Unit is required']
        },
        pricing: {
            unitPrice: {
                type: Number,
                required: [true, 'Unit price is required'],
                min: [0, 'Unit price cannot be negative']
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
            discountAmount: {
                type: Number,
                min: [0, 'Discount amount cannot be negative'],
                default: 0
            },
            gstRate: {
                type: Number,
                enum: [0, 5, 12, 18, 28],
                required: [true, 'GST rate is required'],
                default: 12
            },
            gstAmount: {
                type: Number,
                min: [0, 'GST amount cannot be negative'],
                default: 0
            },
            totalAmount: {
                type: Number,
                required: [true, 'Total amount is required'],
                min: [0, 'Total amount cannot be negative']
            }
        },
        expiryDate: {
            type: Date,
            required: [true, 'Expiry date is required']
        },
        prescriptionRequired: {
            type: Boolean,
            default: false
        }
    }],
    
    // Prescription Information
    prescription: {
        hasPresrciption: {
            type: Boolean,
            default: false
        },
        prescriptionNumber: String,
        doctorName: String,
        doctorLicense: String,
        hospitalName: String,
        prescriptionDate: Date,
        prescriptionImage: String,
        notes: String
    },
    
    // Order Totals
    totals: {
        subtotal: {
            type: Number,
            required: [true, 'Subtotal is required'],
            min: [0, 'Subtotal cannot be negative']
        },
        totalDiscount: {
            type: Number,
            min: [0, 'Total discount cannot be negative'],
            default: 0
        },
        totalGst: {
            type: Number,
            min: [0, 'Total GST cannot be negative'],
            default: 0
        },
        grandTotal: {
            type: Number,
            required: [true, 'Grand total is required'],
            min: [0, 'Grand total cannot be negative']
        },
        roundOff: {
            type: Number,
            default: 0
        },
        finalAmount: {
            type: Number,
            required: [true, 'Final amount is required'],
            min: [0, 'Final amount cannot be negative']
        }
    },
    
    // Payment Information
    payment: {
        method: {
            type: String,
            enum: ['cash', 'card', 'upi', 'net_banking', 'digital_wallet', 'credit', 'insurance'],
            required: [true, 'Payment method is required']
        },
        status: {
            type: String,
            enum: ['pending', 'partial', 'paid', 'failed', 'refunded'],
            default: 'pending'
        },
        paidAmount: {
            type: Number,
            min: [0, 'Paid amount cannot be negative'],
            default: 0
        },
        balanceAmount: {
            type: Number,
            min: [0, 'Balance amount cannot be negative'],
            default: 0
        },
        transactionId: String,
        transactionDate: Date,
        cardDetails: {
            last4Digits: String,
            cardType: String,
            bankName: String
        },
        upiDetails: {
            upiId: String,
            transactionRef: String
        }
    },
    
    // Order Status and Fulfillment
    status: {
        type: String,
        enum: ['pending', 'processing', 'ready', 'delivered', 'cancelled', 'returned'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    fulfillmentType: {
        type: String,
        enum: ['pickup', 'delivery', 'prescription_home_delivery'],
        default: 'pickup'
    },
    
    // Delivery Information
    delivery: {
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String
        },
        deliveryDate: Date,
        deliveryTime: String,
        deliveryFee: {
            type: Number,
            min: [0, 'Delivery fee cannot be negative'],
            default: 0
        },
        deliveryInstructions: String,
        deliveryStatus: {
            type: String,
            enum: ['pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'failed'],
            default: 'pending'
        },
        deliveryPerson: {
            name: String,
            phone: String,
            vehicleNumber: String
        }
    },
    
    // Return/Refund Information
    returns: [{
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, 'Return quantity must be at least 1']
        },
        reason: {
            type: String,
            required: true,
            enum: ['damaged', 'wrong_item', 'expired', 'customer_request', 'quality_issue']
        },
        refundAmount: {
            type: Number,
            required: true,
            min: [0, 'Refund amount cannot be negative']
        },
        returnDate: {
            type: Date,
            default: Date.now
        },
        processedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        notes: String
    }],
    
    // Additional Information
    notes: {
        type: String,
        maxlength: [500, 'Notes cannot exceed 500 characters']
    },
    internalNotes: {
        type: String,
        maxlength: [500, 'Internal notes cannot exceed 500 characters']
    },
    tags: [String],
    
    // Loyalty and Discounts
    loyaltyPoints: {
        earned: {
            type: Number,
            min: [0, 'Loyalty points earned cannot be negative'],
            default: 0
        },
        redeemed: {
            type: Number,
            min: [0, 'Loyalty points redeemed cannot be negative'],
            default: 0
        }
    },
    coupons: [{
        code: String,
        discountType: {
            type: String,
            enum: ['percentage', 'fixed']
        },
        discountValue: Number,
        discountAmount: Number
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
    },
    processedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for customer full name
orderSchema.virtual('customerFullName').get(function() {
    return `${this.customer.firstName} ${this.customer.lastName}`;
});

// Virtual for total items count
orderSchema.virtual('totalItems').get(function() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for profit margin
orderSchema.virtual('profitMargin').get(function() {
    // This would require cost price information from inventory
    // For now, returning 0 - can be calculated in business logic
    return 0;
});

// Indexes for better performance (orderNumber and invoiceNumber already have unique indexes)
orderSchema.index({ shopId: 1 });
orderSchema.index({ 'customer.phone': 1 });
orderSchema.index({ 'customer.email': 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ createdAt: 1 });
orderSchema.index({ 'prescription.prescriptionNumber': 1 });

// Compound indexes
orderSchema.index({ shopId: 1, status: 1 });
orderSchema.index({ shopId: 1, createdAt: -1 });
orderSchema.index({ shopId: 1, 'payment.status': 1 });

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
    if (this.isNew && !this.orderNumber) {
        // Generate order number: ORD + timestamp + random 3 digits
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        this.orderNumber = `ORD${timestamp}${random}`;
    }
    
    // Calculate balance amount
    this.payment.balanceAmount = this.totals.finalAmount - this.payment.paidAmount;
    
    // Update payment status based on paid amount
    if (this.payment.paidAmount === 0) {
        this.payment.status = 'pending';
    } else if (this.payment.paidAmount < this.totals.finalAmount) {
        this.payment.status = 'partial';
    } else if (this.payment.paidAmount >= this.totals.finalAmount) {
        this.payment.status = 'paid';
    }
    
    next();
});

// Static method to find orders by date range
orderSchema.statics.findByDateRange = function(startDate, endDate, shopId = null) {
    const query = {
        createdAt: {
            $gte: startDate,
            $lte: endDate
        }
    };
    
    if (shopId) {
        query.shopId = shopId;
    }
    
    return this.find(query).populate('shopId', 'name').sort({ createdAt: -1 });
};

// Static method to get sales summary
orderSchema.statics.getSalesSummary = function(shopId, startDate, endDate) {
    return this.aggregate([
        {
            $match: {
                shopId: mongoose.Types.ObjectId(shopId),
                createdAt: { $gte: startDate, $lte: endDate },
                status: { $ne: 'cancelled' }
            }
        },
        {
            $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                totalRevenue: { $sum: '$totals.finalAmount' },
                totalDiscount: { $sum: '$totals.totalDiscount' },
                averageOrderValue: { $avg: '$totals.finalAmount' }
            }
        }
    ]);
};

// Method to calculate totals
orderSchema.methods.calculateTotals = function() {
    let subtotal = 0;
    let totalDiscount = 0;
    let totalGst = 0;
    
    this.items.forEach(item => {
        const itemTotal = item.quantity * item.pricing.unitPrice;
        const discountAmount = (itemTotal * item.pricing.discount) / 100;
        const taxableAmount = itemTotal - discountAmount;
        const gstAmount = (taxableAmount * item.pricing.gstRate) / 100;
        
        // Update item totals
        item.pricing.discountAmount = discountAmount;
        item.pricing.gstAmount = gstAmount;
        item.pricing.totalAmount = taxableAmount + gstAmount;
        
        subtotal += itemTotal;
        totalDiscount += discountAmount;
        totalGst += gstAmount;
    });
    
    const grandTotal = subtotal - totalDiscount + totalGst + (this.delivery?.deliveryFee || 0);
    const roundOff = Math.round(grandTotal) - grandTotal;
    const finalAmount = grandTotal + roundOff;
    
    this.totals = {
        subtotal: subtotal,
        totalDiscount: totalDiscount,
        totalGst: totalGst,
        grandTotal: grandTotal,
        roundOff: roundOff,
        finalAmount: finalAmount
    };
    
    return this.totals;
};

module.exports = mongoose.model('Order', orderSchema);
