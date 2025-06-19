const { body, param, query, validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => ({
            field: error.path,
            message: error.msg,
            value: error.value
        }));
        
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errorMessages
        });
    }
    
    next();
};

// User validation rules
const validateUserRegistration = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('firstName')
        .isLength({ min: 2, max: 50 })
        .trim()
        .withMessage('First name must be between 2 and 50 characters'),
    body('lastName')
        .isLength({ min: 2, max: 50 })
        .trim()
        .withMessage('Last name must be between 2 and 50 characters'),
    body('role')
        .isIn(['super_admin', 'hospital_admin', 'shop_admin'])
        .withMessage('Role must be super_admin, hospital_admin, or shop_admin'),
    body('phone')
        .optional()
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),
    handleValidationErrors
];

const validateUserLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    handleValidationErrors
];

const validateUserUpdate = [
    body('email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('firstName')
        .optional()
        .isLength({ min: 2, max: 50 })
        .trim()
        .withMessage('First name must be between 2 and 50 characters'),
    body('lastName')
        .optional()
        .isLength({ min: 2, max: 50 })
        .trim()
        .withMessage('Last name must be between 2 and 50 characters'),
    body('phone')
        .optional()
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),
    body('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean'),
    handleValidationErrors
];

// Hospital validation rules
const validateHospitalRegistration = [
    body('name')
        .isLength({ min: 2, max: 100 })
        .trim()
        .withMessage('Hospital name must be between 2 and 100 characters'),
    body('registrationNumber')
        .notEmpty()
        .trim()
        .withMessage('Registration number is required'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('phone')
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),
    body('address.street')
        .notEmpty()
        .trim()
        .withMessage('Street address is required'),
    body('address.city')
        .notEmpty()
        .trim()
        .withMessage('City is required'),
    body('address.state')
        .notEmpty()
        .trim()
        .withMessage('State is required'),
    body('address.zipCode')
        .notEmpty()
        .trim()
        .withMessage('ZIP code is required'),
    body('type')
        .isIn(['general', 'specialty', 'multispecialty', 'clinic', 'nursing_home'])
        .withMessage('Invalid hospital type'),
    body('bedCapacity')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Bed capacity must be at least 1'),
    body('contactPerson.name')
        .notEmpty()
        .trim()
        .withMessage('Contact person name is required'),
    handleValidationErrors
];

// Shop validation rules
const validateShopRegistration = [
    body('name')
        .isLength({ min: 2, max: 100 })
        .trim()
        .withMessage('Shop name must be between 2 and 100 characters'),
    body('licenseNumber')
        .notEmpty()
        .trim()
        .withMessage('License number is required'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('phone')
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),
    body('address.street')
        .notEmpty()
        .trim()
        .withMessage('Street address is required'),
    body('address.city')
        .notEmpty()
        .trim()
        .withMessage('City is required'),
    body('address.state')
        .notEmpty()
        .trim()
        .withMessage('State is required'),
    body('address.zipCode')
        .notEmpty()
        .trim()
        .withMessage('ZIP code is required'),
    body('type')
        .optional()
        .isIn(['pharmacy', 'medical_store', 'surgical_store', 'herbal_store'])
        .withMessage('Invalid shop type'),
    body('license.number')
        .notEmpty()
        .trim()
        .withMessage('License number is required'),
    body('license.type')
        .isIn(['drug_license', 'pharmacy_license', 'wholesale_license'])
        .withMessage('Invalid license type'),
    body('license.issueDate')
        .isISO8601()
        .withMessage('Invalid license issue date'),
    body('license.expiryDate')
        .isISO8601()
        .withMessage('Invalid license expiry date'),
    body('owner.name')
        .notEmpty()
        .trim()
        .withMessage('Owner name is required'),
    handleValidationErrors
];

// Appointment validation rules
const validateAppointmentBooking = [
    body('patient.firstName')
        .isLength({ min: 2, max: 50 })
        .trim()
        .withMessage('Patient first name must be between 2 and 50 characters'),
    body('patient.lastName')
        .isLength({ min: 2, max: 50 })
        .trim()
        .withMessage('Patient last name must be between 2 and 50 characters'),
    body('patient.email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('patient.phone')
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),
    body('patient.dateOfBirth')
        .isISO8601()
        .isBefore()
        .withMessage('Please provide a valid date of birth'),
    body('patient.gender')
        .isIn(['male', 'female', 'other'])
        .withMessage('Gender must be male, female, or other'),
    body('hospitalId')
        .isMongoId()
        .withMessage('Invalid hospital ID'),
    body('department')
        .isIn([
            'cardiology', 'neurology', 'orthopedics', 'pediatrics', 
            'gynecology', 'dermatology', 'psychiatry', 'radiology',
            'pathology', 'emergency', 'icu', 'general_medicine',
            'general_surgery', 'dentistry', 'ophthalmology', 'ent'
        ])
        .withMessage('Invalid department'),
    body('appointmentDate')
        .isISO8601()
        .isAfter()
        .withMessage('Appointment date must be in the future'),
    body('appointmentTime')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Invalid time format (HH:MM)'),
    body('reasonForVisit')
        .isLength({ min: 5, max: 500 })
        .trim()
        .withMessage('Reason for visit must be between 5 and 500 characters'),
    body('visitType')
        .optional()
        .isIn(['consultation', 'follow_up', 'checkup', 'emergency', 'procedure'])
        .withMessage('Invalid visit type'),
    handleValidationErrors
];

// Inventory validation rules
const validateInventoryItem = [
    body('name')
        .isLength({ min: 2, max: 200 })
        .trim()
        .withMessage('Product name must be between 2 and 200 characters'),
    body('manufacturer')
        .notEmpty()
        .trim()
        .withMessage('Manufacturer is required'),
    body('category')
        .isIn([
            'prescription_drug', 'otc_drug', 'medical_device', 'surgical_instrument',
            'health_supplement', 'baby_care', 'elderly_care', 'first_aid',
            'diagnostic_kit', 'medical_consumables', 'ayurvedic', 'homeopathic'
        ])
        .withMessage('Invalid product category'),
    body('batchNumber')
        .notEmpty()
        .trim()
        .withMessage('Batch number is required'),
    body('sku')
        .notEmpty()
        .trim()
        .withMessage('SKU is required'),
    body('quantity.current')
        .isInt({ min: 0 })
        .withMessage('Current quantity must be a non-negative integer'),
    body('quantity.minimum')
        .isInt({ min: 0 })
        .withMessage('Minimum quantity must be a non-negative integer'),
    body('pricing.costPrice')
        .isFloat({ min: 0 })
        .withMessage('Cost price must be a non-negative number'),
    body('pricing.sellingPrice')
        .isFloat({ min: 0 })
        .withMessage('Selling price must be a non-negative number'),
    body('pricing.mrp')
        .isFloat({ min: 0 })
        .withMessage('MRP must be a non-negative number'),
    body('manufacturingDate')
        .isISO8601()
        .isBefore()
        .withMessage('Manufacturing date must be in the past'),
    body('expiryDate')
        .isISO8601()
        .isAfter()
        .withMessage('Expiry date must be in the future'),
    body('supplier.name')
        .notEmpty()
        .trim()
        .withMessage('Supplier name is required'),
    handleValidationErrors
];

// Order validation rules
const validateOrderCreation = [
    body('customer.firstName')
        .isLength({ min: 2, max: 50 })
        .trim()
        .withMessage('Customer first name must be between 2 and 50 characters'),
    body('customer.lastName')
        .isLength({ min: 2, max: 50 })
        .trim()
        .withMessage('Customer last name must be between 2 and 50 characters'),
    body('customer.phone')
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),
    body('items')
        .isArray({ min: 1 })
        .withMessage('Order must contain at least one item'),
    body('items.*.productId')
        .isMongoId()
        .withMessage('Invalid product ID'),
    body('items.*.quantity')
        .isInt({ min: 1 })
        .withMessage('Quantity must be at least 1'),
    body('payment.method')
        .isIn(['cash', 'card', 'upi', 'net_banking', 'digital_wallet', 'credit', 'insurance'])
        .withMessage('Invalid payment method'),
    handleValidationErrors
];

// Parameter validation
const validateObjectId = (paramName) => [
    param(paramName)
        .isMongoId()
        .withMessage(`Invalid ${paramName}`),
    handleValidationErrors
];

// Query validation
const validatePagination = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    query('sort')
        .optional()
        .isIn(['createdAt', '-createdAt', 'name', '-name', 'updatedAt', '-updatedAt'])
        .withMessage('Invalid sort parameter'),
    handleValidationErrors
];

const validateDateRange = [
    query('startDate')
        .optional()
        .isISO8601()
        .withMessage('Invalid start date format'),
    query('endDate')
        .optional()
        .isISO8601()
        .withMessage('Invalid end date format'),
    handleValidationErrors
];

module.exports = {
    handleValidationErrors,
    validateUserRegistration,
    validateUserLogin,
    validateUserUpdate,
    validateHospitalRegistration,
    validateShopRegistration,
    validateAppointmentBooking,
    validateInventoryItem,
    validateOrderCreation,
    validateObjectId,
    validatePagination,
    validateDateRange
};
