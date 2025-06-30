const User = require('../models/User');
const { generateToken, sanitizeUser } = require('../utils/helpers');
const { sendPasswordResetEmail, sendOTPEmail } = require('../utils/email');
const crypto = require('crypto');

// Request deduplication tracking
const activeLoginSessions = new Map();

// Generate unique session ID
const generateSessionId = () => {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Prevent duplicate requests middleware
const preventDuplicateRequests = (timeWindow = 2000) => {
    return (req, res, next) => {
        const requestKey = `${req.ip}-${req.body.email}`;
        const now = Date.now();
        
        if (activeLoginSessions.has(requestKey)) {
            const lastRequest = activeLoginSessions.get(requestKey);
            if (now - lastRequest.timestamp < timeWindow) {
                console.log(`⚠️  Duplicate login request blocked for ${req.body.email}`);
                return res.status(429).json({
                    success: false,
                    error: 'Login request in progress. Please wait.'
                });
            }
        }
        
        activeLoginSessions.set(requestKey, { timestamp: now });
        next();
    };
};

// Track login session middleware
const trackLoginSession = (req, res, next) => {
    const sessionId = generateSessionId();
    req.loginSessionId = sessionId;
    
    console.log(`🎯 Login session started: ${sessionId} for ${req.body.email}`);
    
    // Track response completion
    const startTime = Date.now();
    const originalSend = res.send;
    let responseSent = false;

    res.send = function(data) {
        if (responseSent) {
            console.log(`⚠️  Duplicate response blocked for session: ${sessionId}`);
            return;
        }
        responseSent = true;
        
        const duration = Date.now() - startTime;
        console.log(`✅ Login session completed: ${sessionId} (${duration}ms)`);
        
        // Clean up session tracking
        const requestKey = `${req.ip}-${req.body.email}`;
        activeLoginSessions.delete(requestKey);
        
        originalSend.call(this, data);
    };
    
    next();
};

// @desc    Consolidated login function with enhanced debugging
// @route   POST /api/auth/login & POST /api/auth/direct-login
// @access  Public
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const sessionId = req.loginSessionId;
        
        console.log(`🔍 Processing login for: ${email} (Session: ${sessionId})`);
        console.log(`🔑 Password provided: ${password ? 'YES' : 'NO'} (Length: ${password ? password.length : 0})`);

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            console.log(`❌ User not found: ${email}`);
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        console.log(`👤 User found: ${email}`);
        console.log(`🏥 Role: ${user.role}`);
        console.log(`🔗 Hospital ID: ${user.hospitalId || 'None'}`);
        console.log(`🏪 Shop ID: ${user.shopId || 'None'}`);
        console.log(`🔐 Password hash exists: ${user.password ? 'YES' : 'NO'}`);
        console.log(`🔐 Password hash length: ${user.password ? user.password.length : 0}`);
        console.log(`✅ Is Active: ${user.isActive}`);

        // Check if user is active
        if (!user.isActive) {
            console.log(`❌ Account deactivated: ${email}`);
            return res.status(401).json({
                success: false,
                error: 'Account is deactivated. Please contact administrator.'
            });
        }

        // Debug password comparison
        console.log(`🔍 Attempting password comparison for: ${email}`);
        console.log(`🔑 Plain password: "${password}"`);
        console.log(`🔐 Hashed password (first 20 chars): ${user.password ? user.password.substring(0, 20) + '...' : 'NULL'}`);

        // Check if password matches
        const isMatch = await user.matchPassword(password);
        console.log(`🎯 Password match result: ${isMatch}`);

        if (!isMatch) {
            console.log(`❌ Invalid password for: ${email}`);
            console.log(`🔍 Double-checking password hash format...`);
            
            // Additional debug: Check if password looks like bcrypt hash
            const isBcryptHash = user.password && user.password.startsWith('$2');
            console.log(`🔐 Password appears to be bcrypt hash: ${isBcryptHash}`);
            
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
            email: user.email,
            hospitalId: user.hospitalId,
            shopId: user.shopId
        });

        // Remove password from output
        const sanitizedUser = sanitizeUser(user);

        console.log(`✅ Login successful for: ${email} (Role: ${user.role})`);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: sanitizedUser
            }
        });

    } catch (error) {
        console.error(`❌ Login error for session ${req.loginSessionId}:`, error.message);
        console.error(`📍 Error stack:`, error.stack);
        next(error);
    }
};

// Alias for backward compatibility - prevents code duplication
const directLogin = login;
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

// Debug route to check route definitions (remove in production)
const debugRoutes = (req, res) => {
    const routes = {
        authRoutes: [
            'POST /api/auth/login',
            'POST /api/auth/direct-login',
            'GET /api/auth/me',
            'POST /api/auth/logout',
            'POST /api/auth/register',
            'PUT /api/auth/profile',
            'PUT /api/auth/change-password',
            'POST /api/auth/forgot-password',
            'POST /api/auth/reset-password',
            'POST /api/auth/refresh-token',
            'POST /api/auth/verify-token'
        ],
        loginEndpoints: {
            '/login': 'Standard login endpoint',
            '/direct-login': 'Alias to login endpoint (same function)'
        },
        duplicateProtection: {
            requestDeduplication: 'Active (2 second window)',
            sessionTracking: 'Active',
            responseProtection: 'Active'
        }
    };

    res.status(200).json({
        success: true,
        message: 'Auth routes debug information',
        data: routes
    });
};

// Debug route to test admin-created credentials (remove in production)
const testAdminCredentials = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required for testing'
            });
        }

        console.log(`🧪 Testing credentials for: ${email}`);
        console.log(`🔑 Testing password: "${password}"`);

        // Find user
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
                debug: {
                    searchedEmail: email
                }
            });
        }

        // Debug info
        const debugInfo = {
            userFound: true,
            userId: user._id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            isActive: user.isActive,
            createdAt: user.createdAt,
            hasPassword: !!user.password,
            passwordHashLength: user.password ? user.password.length : 0,
            passwordStartsWithBcrypt: user.password ? user.password.startsWith('$2') : false,
            hospitalId: user.hospitalId,
            shopId: user.shopId,
            lastLogin: user.lastLogin
        };

        console.log(`👤 User debug info:`, debugInfo);

        // Test password match
        let passwordMatch = false;
        let matchError = null;

        try {
            passwordMatch = await user.matchPassword(password);
            console.log(`🎯 Password match result: ${passwordMatch}`);
        } catch (error) {
            matchError = error.message;
            console.error(`❌ Password match error:`, error);
        }

        // Response
        res.status(200).json({
            success: true,
            message: 'Credential test completed',
            data: {
                ...debugInfo,
                passwordMatch,
                matchError,
                testPassword: password
            }
        });

    } catch (error) {
        console.error(`❌ Credential test error:`, error);
        res.status(500).json({
            success: false,
            error: 'Credential test failed',
            debug: error.message
        });
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
    register,
    // Middleware exports
    preventDuplicateRequests,
    trackLoginSession,
    debugRoutes,
    testAdminCredentials
    // sendOTP, verifyOTP, resendOTP - commented out for now
};
