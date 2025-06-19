const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    // Patient Information
    patient: {
        firstName: {
            type: String,
            required: [true, 'Patient first name is required'],
            trim: true,
            maxlength: [50, 'First name cannot exceed 50 characters']
        },
        lastName: {
            type: String,
            required: [true, 'Patient last name is required'],
            trim: true,
            maxlength: [50, 'Last name cannot exceed 50 characters']
        },
        email: {
            type: String,
            required: [true, 'Patient email is required'],
            lowercase: true,
            trim: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please enter a valid email'
            ]
        },
        phone: {
            type: String,
            required: [true, 'Patient phone is required'],
            trim: true,
            match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
        },
        dateOfBirth: {
            type: Date,
            required: [true, 'Date of birth is required'],
            validate: {
                validator: function(value) {
                    return value < new Date();
                },
                message: 'Date of birth must be in the past'
            }
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other'],
            required: [true, 'Gender is required']
        },
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: { type: String, default: 'India' }
        },
        emergencyContact: {
            name: String,
            phone: String,
            relationship: String
        }
    },

    // Hospital and Department
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: [true, 'Hospital is required']
    },
    department: {
        type: String,
        enum: [
            'cardiology', 'neurology', 'orthopedics', 'pediatrics', 
            'gynecology', 'dermatology', 'psychiatry', 'radiology',
            'pathology', 'emergency', 'icu', 'general_medicine',
            'general_surgery', 'dentistry', 'ophthalmology', 'ent'
        ],
        required: [true, 'Department is required']
    },
    
    // Doctor Information (optional - for future use)
    doctor: {
        name: String,
        specialization: String,
        licenseNumber: String
    },

    // Appointment Details
    appointmentDate: {
        type: Date,
        required: [true, 'Appointment date is required'],
        validate: {
            validator: function(value) {
                return value >= new Date();
            },
            message: 'Appointment date must be in the future'
        }
    },
    appointmentTime: {
        type: String,
        required: [true, 'Appointment time is required'],
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)']
    },
    duration: {
        type: Number,
        default: 30, // Duration in minutes
        min: [15, 'Minimum duration is 15 minutes'],
        max: [240, 'Maximum duration is 4 hours']
    },

    // Appointment Status
    status: {
        type: String,
        enum: ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'],
        default: 'scheduled'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'emergency'],
        default: 'medium'
    },

    // Visit Type
    visitType: {
        type: String,
        enum: ['consultation', 'follow_up', 'checkup', 'emergency', 'procedure'],
        required: [true, 'Visit type is required'],
        default: 'consultation'
    },

    // Reason and Symptoms
    reasonForVisit: {
        type: String,
        required: [true, 'Reason for visit is required'],
        maxlength: [500, 'Reason cannot exceed 500 characters']
    },
    symptoms: [{
        type: String,
        trim: true
    }],
    notes: {
        type: String,
        maxlength: [1000, 'Notes cannot exceed 1000 characters']
    },

    // Medical History
    hasAllergies: {
        type: Boolean,
        default: false
    },
    allergies: [{
        allergen: String,
        severity: {
            type: String,
            enum: ['mild', 'moderate', 'severe']
        },
        reaction: String
    }],
    currentMedications: [{
        name: String,
        dosage: String,
        frequency: String
    }],
    medicalHistory: [{
        condition: String,
        diagnosedDate: Date,
        status: {
            type: String,
            enum: ['active', 'resolved', 'chronic']
        }
    }],

    // Insurance Information
    insurance: {
        hasInsurance: {
            type: Boolean,
            default: false
        },
        provider: String,
        policyNumber: String,
        groupNumber: String
    },

    // Payment Information
    payment: {
        consultationFee: {
            type: Number,
            min: [0, 'Fee cannot be negative']
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'partial', 'paid', 'refunded'],
            default: 'pending'
        },
        paymentMethod: {
            type: String,
            enum: ['cash', 'card', 'upi', 'net_banking', 'insurance']
        },
        transactionId: String
    },

    // Appointment Management
    bookedBy: {
        type: String,
        enum: ['patient', 'hospital_staff', 'online'],
        default: 'online'
    },
    confirmationCode: {
        type: String,
        unique: true,
        uppercase: true
    },
    reminderSent: {
        type: Boolean,
        default: false
    },
    reminderDate: Date,

    // Cancellation Details
    cancellation: {
        cancelledAt: Date,
        cancelledBy: {
            type: String,
            enum: ['patient', 'hospital', 'system']
        },
        reason: String,
        refundAmount: Number,
        refundStatus: {
            type: String,
            enum: ['pending', 'processed', 'declined']
        }
    },

    // Follow-up
    followUp: {
        isRequired: {
            type: Boolean,
            default: false
        },
        scheduledDate: Date,
        notes: String
    },

    // Metadata
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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

// Virtual for patient full name
appointmentSchema.virtual('patientFullName').get(function() {
    return `${this.patient.firstName} ${this.patient.lastName}`;
});

// Virtual for patient age
appointmentSchema.virtual('patientAge').get(function() {
    if (this.patient.dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(this.patient.dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
    return null;
});

// Virtual for appointment datetime
appointmentSchema.virtual('appointmentDateTime').get(function() {
    if (this.appointmentDate && this.appointmentTime) {
        const [hours, minutes] = this.appointmentTime.split(':');
        const dateTime = new Date(this.appointmentDate);
        dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        return dateTime;
    }
    return null;
});

// Indexes for better performance
appointmentSchema.index({ hospitalId: 1 });
appointmentSchema.index({ appointmentDate: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ 'patient.email': 1 });
appointmentSchema.index({ 'patient.phone': 1 });
appointmentSchema.index({ confirmationCode: 1 });
appointmentSchema.index({ department: 1 });
appointmentSchema.index({ visitType: 1 });
appointmentSchema.index({ createdAt: 1 });

// Compound indexes
appointmentSchema.index({ hospitalId: 1, appointmentDate: 1 });
appointmentSchema.index({ hospitalId: 1, status: 1 });
appointmentSchema.index({ appointmentDate: 1, status: 1 });

// Pre-save middleware to generate confirmation code
appointmentSchema.pre('save', function(next) {
    if (this.isNew && !this.confirmationCode) {
        // Generate 6-character alphanumeric confirmation code
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        this.confirmationCode = code;
    }
    next();
});

// Static method to find appointments by date range
appointmentSchema.statics.findByDateRange = function(startDate, endDate, hospitalId = null) {
    const query = {
        appointmentDate: {
            $gte: startDate,
            $lte: endDate
        }
    };
    
    if (hospitalId) {
        query.hospitalId = hospitalId;
    }
    
    return this.find(query).populate('hospitalId', 'name address');
};

// Static method to find upcoming appointments
appointmentSchema.statics.findUpcoming = function(hospitalId = null, days = 7) {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);
    
    return this.findByDateRange(startDate, endDate, hospitalId);
};

// Method to check if appointment can be cancelled
appointmentSchema.methods.canBeCancelled = function() {
    const now = new Date();
    const appointmentDateTime = this.appointmentDateTime;
    
    if (!appointmentDateTime) return false;
    
    // Can be cancelled if appointment is at least 24 hours away
    const hoursUntilAppointment = (appointmentDateTime - now) / (1000 * 60 * 60);
    return hoursUntilAppointment >= 24 && ['scheduled', 'confirmed'].includes(this.status);
};

module.exports = mongoose.model('Appointment', appointmentSchema);
