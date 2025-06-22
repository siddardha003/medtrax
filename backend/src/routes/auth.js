const express = require('express');
const {
    login,
    directLogin,
    getMe,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    logout,
    refreshToken,
    verifyToken,
    register,
    preventDuplicateRequests,
    trackLoginSession,
    debugRoutes,
    testAdminCredentials
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');
const {
    validateUserLogin,
    handleValidationErrors
} = require('../middleware/validation');
const { body } = require('express-validator');

const router = express.Router();

// Debug routes (remove in production)
router.get('/debug/routes', debugRoutes);
router.post('/debug/test-credentials', testAdminCredentials);

// @route   POST /api/auth/login
// @desc    Login user with enhanced duplicate protection
// @access  Public
router.post('/login', 
    preventDuplicateRequests(2000),
    trackLoginSession,
    validateUserLogin, 
    login
);

// @route   POST /api/auth/direct-login
// @desc    Direct login (alias to login with same protections)
// @access  Public
router.post('/direct-login', 
    preventDuplicateRequests(2000),
    trackLoginSession,
    validateUserLogin, 
    directLogin
);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', protect, logout);

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', protect, getMe);

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, updateProfile);

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', [
    protect,
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),
    handleValidationErrors
], changePassword);

// @route   POST /api/auth/refresh
// @desc    Refresh JWT token
// @access  Private
router.post('/refresh', protect, refreshToken);

// @route   GET /api/auth/validate
// @desc    Validate JWT token
// @access  Private
router.get('/validate', protect, verifyToken);

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', [
    body('name')
        .notEmpty()
        .trim()
        .withMessage('Name is required'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('phone')
        .optional(),
    body('gender')
        .optional(),
    handleValidationErrors
], register);

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    handleValidationErrors
], forgotPassword);

// @route   PUT /api/auth/reset-password/:resettoken
// @desc    Reset password
// @access  Public
router.put('/reset-password/:resettoken', [
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long'),
    handleValidationErrors
], resetPassword);

module.exports = router;
