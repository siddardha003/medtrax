const express = require('express');
const {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    createHospital,
    getHospitals,
    getHospital,
    updateHospital,
    deleteHospital,
    createShop,
    getShops,
    getShop,
    updateShop,
    deleteShop,
    getSystemStats,
    getUserStats
} = require('../controllers/adminController');

const { protect, authorize } = require('../middleware/auth');
const {
    validateUserRegistration,
    validateUserUpdate,
    validateHospitalRegistration,
    validateShopRegistration,
    validateObjectId,
    validatePagination,
    validateDateRange
} = require('../middleware/validation');

const router = express.Router();

// Protect all routes - only super admins can access
router.use(protect);
router.use(authorize('super_admin'));

// User Management Routes
// @route   POST /api/admin/users
// @desc    Create new user (Hospital Admin or Shop Admin)
// @access  Private (Super Admin only)
router.post('/users', validateUserRegistration, createUser);

// @route   GET /api/admin/users
// @desc    Get all users with filtering and pagination
// @access  Private (Super Admin only)
router.get('/users', validatePagination, getUsers);

// @route   GET /api/admin/users/stats
// @desc    Get user statistics
// @access  Private (Super Admin only)
router.get('/users/stats', validateDateRange, getUserStats);

// @route   GET /api/admin/users/:id
// @desc    Get single user by ID
// @access  Private (Super Admin only)
router.get('/users/:id', validateObjectId('id'), getUser);

// @route   PUT /api/admin/users/:id
// @desc    Update user details
// @access  Private (Super Admin only)
router.put('/users/:id', [
    validateObjectId('id'),
    validateUserUpdate
], updateUser);

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private (Super Admin only)
router.delete('/users/:id', validateObjectId('id'), deleteUser);

// Hospital Management Routes
// @route   POST /api/admin/hospitals
// @desc    Register new hospital
// @access  Private (Super Admin only)
router.post('/hospitals', validateHospitalRegistration, createHospital);

// @route   GET /api/admin/hospitals
// @desc    Get all hospitals with filtering and pagination
// @access  Private (Super Admin only)
router.get('/hospitals', validatePagination, getHospitals);

// @route   GET /api/admin/hospitals/:id
// @desc    Get single hospital by ID
// @access  Private (Super Admin only)
router.get('/hospitals/:id', validateObjectId('id'), getHospital);

// @route   PUT /api/admin/hospitals/:id
// @desc    Update hospital details
// @access  Private (Super Admin only)
router.put('/hospitals/:id', validateObjectId('id'), updateHospital);

// @route   DELETE /api/admin/hospitals/:id
// @desc    Delete hospital
// @access  Private (Super Admin only)
router.delete('/hospitals/:id', validateObjectId('id'), deleteHospital);

// Medical Shop Management Routes
// @route   POST /api/admin/shops
// @desc    Register new medical shop
// @access  Private (Super Admin only)
router.post('/shops', validateShopRegistration, createShop);

// @route   GET /api/admin/shops
// @desc    Get all medical shops with filtering and pagination
// @access  Private (Super Admin only)
router.get('/shops', validatePagination, getShops);

// @route   GET /api/admin/shops/:id
// @desc    Get single medical shop by ID
// @access  Private (Super Admin only)
router.get('/shops/:id', validateObjectId('id'), getShop);

// @route   PUT /api/admin/shops/:id
// @desc    Update medical shop details
// @access  Private (Super Admin only)
router.put('/shops/:id', validateObjectId('id'), updateShop);

// @route   DELETE /api/admin/shops/:id
// @desc    Delete medical shop
// @access  Private (Super Admin only)
router.delete('/shops/:id', validateObjectId('id'), deleteShop);

// System Statistics Routes
// @route   GET /api/admin/stats
// @desc    Get system-wide statistics
// @access  Private (Super Admin only)
router.get('/stats', validateDateRange, getSystemStats);

module.exports = router;
