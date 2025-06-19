const express = require('express');
const {
    login,
    getMe,
    updateProfile,
    changePassword,
    logout,
    refreshToken,
    verifyToken
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');
const {
    validateUserLogin,
    handleValidationErrors
} = require('../middleware/validation');
const { body } = require('express-validator');

const router = express.Router();

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateUserLogin, login);

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

module.exports = router;
