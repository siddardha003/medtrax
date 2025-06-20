const User = require('../models/User');
const { generateToken, sanitizeUser } = require('../utils/helpers');
const { sendPasswordResetEmail, sendOTPEmail } = require('../utils/email');
const crypto = require('crypto');

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                error: 'Account is deactivated. Please contact administrator.'
            });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Create token
        const token = generateToken({ 
            id: user._id,
            role: user.role,
            email: user.email
        });

        // Remove password from output
        const sanitizedUser = sanitizeUser(user);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: sanitizedUser
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Direct login without OTP (for admin or emergency access)
// @route   POST /api/auth/direct-login
// @access  Public
const directLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                error: 'Account is deactivated. Please contact administrator.'
            });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Create token
        const token = generateToken({ 
            id: user._id,
            role: user.role,
            email: user.email
        });

        // Remove password from output
        const sanitizedUser = sanitizeUser(user);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: sanitizedUser
            }
        });

    } catch (error) {
        next(error);
    }
};
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('hospitalId', 'name address type')
            .populate('shopId', 'name address type');

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        const sanitizedUser = sanitizeUser(user);

        res.status(200).json({
            success: true,
            data: {
                user: sanitizedUser
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
    try {
        const fieldsToUpdate = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone
        };

        // Remove undefined fields
        Object.keys(fieldsToUpdate).forEach(key => {
            if (fieldsToUpdate[key] === undefined) {
                delete fieldsToUpdate[key];
            }
        });

        const user = await User.findByIdAndUpdate(
            req.user.id,
            fieldsToUpdate,
            {
                new: true,
                runValidators: true
            }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        const sanitizedUser = sanitizeUser(user);

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user: sanitizedUser
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Get user with password
        const user = await User.findById(req.user.id).select('+password');

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Check current password
        const isMatch = await user.matchPassword(currentPassword);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                error: 'Current password is incorrect'
            });
        }

        // Validate new password
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'New password must be at least 6 characters long'
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'No user found with that email address'
            });
        }

        if (!user.isActive) {
            return res.status(400).json({
                success: false,
                error: 'Account is deactivated. Please contact administrator.'
            });
        }

        // Get reset token
        const resetToken = user.getResetPasswordToken();

        await user.save({ validateBeforeSave: false });

        try {
            await sendPasswordResetEmail(user, resetToken);

            res.status(200).json({
                success: true,
                message: 'Password reset email sent successfully'
            });
        } catch (error) {
            console.error('Email send error:', error);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save({ validateBeforeSave: false });

            return res.status(500).json({
                success: false,
                error: 'Email could not be sent'
            });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resettoken
// @access  Public
const resetPassword = async (req, res, next) => {
    try {
        const { newPassword } = req.body;

        // Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.resettoken)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                error: 'Invalid or expired reset token'
            });
        }

        // Validate new password
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'Password must be at least 6 characters long'
            });
        }

        // Set new password
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password reset successful'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res, next) => {
    try {
        // In a stateless JWT setup, we don't need to do anything server-side
        // The client should remove the token from storage
        
        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Verify token
// @route   GET /api/auth/verify
// @access  Private
const verifyToken = async (req, res, next) => {
    try {
        // If middleware passed, token is valid
        const user = await User.findById(req.user.id);

        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                error: 'Token is no longer valid'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Token is valid',
            data: {
                user: sanitizeUser(user)
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Private
const refreshToken = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                error: 'User not found or inactive'
            });
        }

        // Generate new token
        const newToken = generateToken({ 
            id: user._id,
            role: user.role,
            email: user.email
        });

        res.status(200).json({
            success: true,
            message: 'Token refreshed successfully',
            data: {
                token: newToken
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
    try {
        const { name, email, phone, gender, password } = req.body;
        
        console.log('Registration request body:', req.body);
        
        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                error: 'Name, email, and password are required' 
            });
        }
        
        // Split name into first and last (simple split)
        const nameParts = name.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : firstName;
        
        // Check if user exists
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ 
                success: false, 
                error: 'Email already registered' 
            });
        }
          const user = await User.create({
            email,
            password,
            firstName,
            lastName,
            phone: phone || '',
            gender: gender || '',
            role: 'user', // Set default role as regular user
            isEmailVerified: true // Set to true for now since we're not using OTP
        });
        
        res.status(201).json({ 
            success: true, 
            message: 'Registration successful! You can now login.',
            data: { 
                email: user.email, 
                id: user._id            } 
        });
    } catch (error) {
        console.error('Registration error:', error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                error: messages.join(', ')
            });
        }
        
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'Email already registered'
            });
        }
        
        next(error);
    }
};

// @desc    Send OTP for email verification
// @route   POST /api/auth/send-otp
// @access  Public
const sendOTP = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                error: 'Email is required'
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'No user found with that email address'
            });
        }

        if (!user.isActive) {
            return res.status(400).json({
                success: false,
                error: 'Account is deactivated. Please contact administrator.'
            });
        }

        // Generate OTP
        const otp = user.generateOTP();
        await user.save();

        try {
            await sendOTPEmail(user, otp);

            res.status(200).json({
                success: true,
                message: 'OTP sent successfully to your email'
            });
        } catch (error) {
            console.error('OTP email send error:', error);
            user.otp = undefined;
            user.otpExpire = undefined;
            await user.save();

            return res.status(500).json({
                success: false,
                error: 'OTP email could not be sent'
            });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Verify OTP and complete login
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                error: 'Email and OTP are required'
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                error: 'Account is deactivated. Please contact administrator.'
            });
        }

        // Verify OTP
        const isValidOTP = user.verifyOTP(otp);

        if (!isValidOTP) {
            return res.status(400).json({
                success: false,
                error: 'Invalid or expired OTP'
            });
        }

        // Clear OTP after successful verification
        user.otp = undefined;
        user.otpExpire = undefined;
        user.isEmailVerified = true;
        user.lastLogin = new Date();
        await user.save();

        // Create token
        const token = generateToken({ 
            id: user._id,
            role: user.role,
            email: user.email
        });

        // Remove password from output
        const sanitizedUser = sanitizeUser(user);

        res.status(200).json({
            success: true,
            message: 'OTP verified successfully. Login completed.',
            data: {
                token,
                user: sanitizedUser
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOTP = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                error: 'Email is required'
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'No user found with that email address'
            });
        }

        if (!user.isActive) {
            return res.status(400).json({
                success: false,
                error: 'Account is deactivated. Please contact administrator.'
            });
        }

        // Generate new OTP
        const otp = user.generateOTP();
        await user.save();

        try {
            await sendOTPEmail(user, otp);

            res.status(200).json({
                success: true,
                message: 'New OTP sent successfully to your email'
            });
        } catch (error) {
            console.error('OTP resend error:', error);
            user.otp = undefined;
            user.otpExpire = undefined;
            await user.save();

            return res.status(500).json({
                success: false,
                error: 'OTP email could not be sent'
            });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    login,
    directLogin,
    getMe,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    logout,
    verifyToken,
    refreshToken,
    register
    // sendOTP, verifyOTP, resendOTP - commented out for now
};
