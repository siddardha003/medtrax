const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    // Flat patient info for public bookings
    patientName: {
        type: String,
        required: [true, 'Patient name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    patientPhone: {
        type: String,
        required: [true, 'Patient phone is required'],
        trim: true
    },
    patientEmail: {
        type: String,
        required: [true, 'Patient email is required'],
        trim: true
    },
    // Hospital and Department
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: [true, 'Hospital is required']
    },
    department: {
        type: String,
        required: [true, 'Department is required']
    },
    doctorId: {
        type: String,
        required: [true, 'Doctor is required']
    },
    // Appointment Details
    appointmentDate: {
        type: Date,
        required: [true, 'Appointment date is required']
    },
    appointmentTime: {
        type: String,
        required: [true, 'Appointment time is required']
    },
    notes: {
        type: String,
        maxlength: [1000, 'Notes cannot exceed 1000 characters']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

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

// Indexes for better performance (confirmationCode already has unique index)
appointmentSchema.index({ hospitalId: 1 });
appointmentSchema.index({ appointmentDate: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ 'patient.email': 1 });
appointmentSchema.index({ 'patient.phone': 1 });
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
