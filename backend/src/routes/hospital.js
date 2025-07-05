const express = require('express');
const {
    getAppointments,
    getAppointment,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    getAppointmentStats,
    searchPatients,
    getHospitalProfile,
    updateHospitalProfile,
    uploadHospitalImage,
    updateDoctorSlots,
    getDoctorAvailableSlots
} = require('../controllers/hospitalController');

const { protect, authorize, validateUserRole } = require('../middleware/auth');
const {
    validateAppointmentBooking,
    validateObjectId,
    validatePagination,
    validateDateRange,
    handleValidationErrors
} = require('../middleware/validation');
const { body, query } = require('express-validator');

const router = express.Router();

// Protect all routes - only hospital admins can access
router.use(protect);
router.use(authorize('hospital_admin'));
router.use(validateUserRole);

// Appointment Management Routes

// @route   GET /api/hospital/appointments
// @desc    Get all appointments for the hospital
// @access  Private (Hospital Admin only)
router.get('/appointments', [
    validatePagination,
    query('status')
        .optional()
        .isIn(['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'])
        .withMessage('Invalid status'),
    query('department')
        .optional()
        .isIn([
            'cardiology', 'neurology', 'orthopedics', 'pediatrics', 
            'gynecology', 'dermatology', 'psychiatry', 'radiology',
            'pathology', 'emergency', 'icu', 'general_medicine',
            'general_surgery', 'dentistry', 'ophthalmology', 'ent'
        ])
        .withMessage('Invalid department'),
    query('date')
        .optional()
        .isISO8601()
        .withMessage('Invalid date format'),
    query('search')
        .optional()
        .isLength({ min: 2 })
        .withMessage('Search query must be at least 2 characters'),
    handleValidationErrors
], getAppointments);

// @route   GET /api/hospital/appointments/stats
// @desc    Get appointment statistics for the hospital
// @access  Private (Hospital Admin only)
router.get('/appointments/stats', [
    query('period')
        .optional()
        .isIn(['today', 'week', 'month', 'year'])
        .withMessage('Invalid period'),
    handleValidationErrors
], getAppointmentStats);

// @route   GET /api/hospital/appointments/:id
// @desc    Get single appointment by ID
// @access  Private (Hospital Admin only)
router.get('/appointments/:id', validateObjectId('id'), getAppointment);

// @route   POST /api/hospital/appointments
// @desc    Create new appointment
// @access  Private (Hospital Admin only)
router.post('/appointments', validateAppointmentBooking, createAppointment);

// @route   PUT /api/hospital/appointments/:id
// @desc    Update appointment details
// @access  Private (Hospital Admin only)
router.put('/appointments/:id', [
    validateObjectId('id'),
    body('patient.firstName')
        .optional()
        .isLength({ min: 2, max: 50 })
        .trim()
        .withMessage('Patient first name must be between 2 and 50 characters'),
    body('patient.lastName')
        .optional()
        .isLength({ min: 2, max: 50 })
        .trim()
        .withMessage('Patient last name must be between 2 and 50 characters'),
    body('patient.email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('patient.phone')
        .optional()
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),
    body('appointmentDate')
        .optional()
        .isISO8601()
        .isAfter()
        .withMessage('Appointment date must be in the future'),
    body('appointmentTime')
        .optional()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Invalid time format (HH:MM)'),
    body('status')
        .optional()
        .isIn(['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'])
        .withMessage('Invalid status'),
    body('department')
        .optional()
        .isIn([
            'cardiology', 'neurology', 'orthopedics', 'pediatrics', 
            'gynecology', 'dermatology', 'psychiatry', 'radiology',
            'pathology', 'emergency', 'icu', 'general_medicine',
            'general_surgery', 'dentistry', 'ophthalmology', 'ent'
        ])
        .withMessage('Invalid department'),
    body('reasonForVisit')
        .optional()
        .isLength({ min: 5, max: 500 })
        .trim()
        .withMessage('Reason for visit must be between 5 and 500 characters'),
    body('notes')
        .optional()
        .isLength({ max: 1000 })
        .trim()
        .withMessage('Notes cannot exceed 1000 characters'),
    handleValidationErrors
], updateAppointment);

// @route   DELETE /api/hospital/appointments/:id
// @desc    Cancel appointment
// @access  Private (Hospital Admin only)
router.delete('/appointments/:id', [
    validateObjectId('id'),
    body('reason')
        .optional()
        .isLength({ max: 500 })
        .trim()
        .withMessage('Cancellation reason cannot exceed 500 characters'),
    handleValidationErrors
], cancelAppointment);

// Hospital Profile Management Routes

// @route   GET /api/hospital/profile
// @desc    Get hospital profile details
// @access  Private (Hospital Admin only)
router.get('/profile', getHospitalProfile);

// @route   PUT /api/hospital/profile
// @desc    Update hospital profile details
// @access  Private (Hospital Admin only)
router.put('/profile', [
    body('closingTime')
        .optional()
        .isString()
        .trim()
        .withMessage('Closing time must be a string'),
    
    body('openingTimes')
        .optional()
        .isArray()
        .withMessage('Opening times must be an array'),
    
    body('openingTimes.*.day')
        .optional()
        .isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
        .withMessage('Invalid day'),
    
    body('openingTimes.*.time')
        .optional()
        .isString()
        .trim()
        .withMessage('Time must be a string'),
    
    body('images')
        .optional()
        .isArray()
        .withMessage('Images must be an array'),
    
    body('services')
        .optional()
        .isArray()
        .withMessage('Services must be an array'),
    
    body('services.*.category')
        .optional()
        .isString()
        .trim()
        .withMessage('Service category must be a string'),
    
    body('services.*.description')
        .optional()
        .isString()
        .trim()
        .withMessage('Service description must be a string'),
    
    body('location.latitude')
        .optional()
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude must be a number between -90 and 90'),
    
    body('location.longitude')
        .optional()
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude must be a number between -180 and 180'),
    
    handleValidationErrors
], updateHospitalProfile);

// @route   POST /api/hospital/profile/upload-image
// @desc    Upload hospital image
// @access  Private (Hospital Admin only)
router.post('/profile/upload-image', uploadHospitalImage);

// Patient Management Routes

// @route   GET /api/hospital/patients/search
// @desc    Search patients by name, email, or phone
// @access  Private (Hospital Admin only)
router.get('/patients/search', [
    query('q')
        .isLength({ min: 2 })
        .withMessage('Search query must be at least 2 characters'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage('Limit must be between 1 and 50'),
    handleValidationErrors
], searchPatients);

// Doctor Slot Management Routes
// @route   PUT /api/hospital/department/:deptIndex/doctor/:docIndex/slots
// @desc    Update a doctor's availability (time slots)
router.put('/department/:deptIndex/doctor/:docIndex/slots', updateDoctorSlots);

// @route   GET /api/hospital/department/:deptIndex/doctor/:docIndex/available-slots
// @desc    Get available slots for a doctor on a given date
router.get('/department/:deptIndex/doctor/:docIndex/available-slots', getDoctorAvailableSlots);

// TEST AUTH ROUTE
// @route   GET /api/hospital/test-auth
// @desc    Test authentication and req.user
router.get('/test-auth', (req, res) => {
  res.json({ user: req.user || null });
});

module.exports = router;
