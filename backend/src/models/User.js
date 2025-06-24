const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
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
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },    role: {
        type: String,
        enum: ['super_admin', 'hospital_admin', 'shop_admin', 'user'],
        default: 'user',
        required: [true, 'Role is required']
    },
    firstName: {
        type: String,
        required: false, // No longer required for any user
        trim: true,
        maxlength: [50, 'First name cannot exceed 50 characters'],
        default: ''
    },    lastName: {
        type: String,
        required: false,
        trim: true,
        maxlength: [50, 'Last name cannot exceed 50 characters'],
        default: ''
    },
    phone: {
        type: String,
        trim: true,
        match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date,
        default: null
    },
    profileImage: {
        type: String,
        default: null
    },
    // Reference to Hospital or Shop based on role
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        default: null
    },
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        default: null
    },    // For password reset functionality
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    // For OTP functionality
    otp: String,
    otpExpire: Date,
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    // Metadata
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
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

// Virtual for full name
userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

// Index for better performance (email already has unique index from schema)
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();

    try {
        // Hash password with cost of 12
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Instance method to check password
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Instance method to generate and hash password token
userSchema.methods.getResetPasswordToken = function() {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    return resetToken;
};

// Instance method to generate OTP
userSchema.methods.generateOTP = function() {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set OTP and expiration time (5 minutes)
    this.otp = otp;
    this.otpExpire = Date.now() + 5 * 60 * 1000; // 5 minutes
    
    return otp;
};

// Instance method to verify OTP
userSchema.methods.verifyOTP = function(enteredOTP) {
    // Check if OTP exists and hasn't expired
    if (!this.otp || !this.otpExpire || Date.now() > this.otpExpire) {
        return false;
    }
    
    return this.otp === enteredOTP;
};

// Static method to get users by role
userSchema.statics.getUsersByRole = function(role) {
    return this.find({ role, isActive: true }).select('-password');
};

// Pre-remove middleware to handle cascading deletes
userSchema.pre('remove', async function(next) {
    // Add logic here if you want to handle related data deletion
    next();
});

module.exports = mongoose.model('User', userSchema);
