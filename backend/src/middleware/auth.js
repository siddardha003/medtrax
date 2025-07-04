const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
const protect = async (req, res, next) => {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    error: 'User not found'
                });
            }

            // Ensure hospitalId and shopId are set from the token if available
            if (decoded.hospitalId && !req.user.hospitalId) {
                req.user.hospitalId = decoded.hospitalId;
                
            }
            
            if (decoded.shopId && !req.user.shopId) {
                req.user.shopId = decoded.shopId;
                
            }

            // Check if user is active
            if (!req.user.isActive) {
                return res.status(401).json({
                    success: false,
                    error: 'User account is deactivated'
                });
            }

            next();
        } catch (error) {
            console.error('JWT Error:', error.message);
            
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    error: 'Token expired'
                });
            }
            
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid token'
                });
            }

            return res.status(401).json({
                success: false,
                error: 'Not authorized to access this route'
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Not authorized, no token'
        });
    }
};

// Middleware to grant access to specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }

        

        
        

        if (!roles.includes(req.user.role)) {
            
            return res.status(403).json({
                success: false,
                error: `Role ${req.user.role} is not authorized to access this route. Required roles: ${roles.join(', ')}`
            });
        }
        
        
        next();
    };
};

// Middleware to check if user owns the resource or is super admin
const checkOwnership = (resourceField = 'userId') => {
    return (req, res, next) => {
        // Super admin can access all resources
        if (req.user.role === 'super_admin') {
            return next();
        }

        // Check if user owns the resource
        const resourceId = req.params.id || req.body[resourceField] || req.query[resourceField];
        
        // For hospital admin, check if they belong to the hospital
        if (req.user.role === 'hospital_admin') {
            if (resourceField === 'hospitalId') {
                if (req.user.hospitalId && req.user.hospitalId.toString() === resourceId) {
                    return next();
                }
            }
        }
        
        // For shop admin, check if they belong to the shop
        if (req.user.role === 'shop_admin') {
            if (resourceField === 'shopId') {
                if (req.user.shopId && req.user.shopId.toString() === resourceId) {
                    return next();
                }
            }
        }

        return res.status(403).json({
            success: false,
            error: 'Not authorized to access this resource'
        });
    };
};

// Middleware to validate user role and associated entity
const validateUserRole = async (req, res, next) => {
    try {
        const user = req.user;
        

        // For hospital admin, ensure they have a valid hospital association
        if (user.role === 'hospital_admin') {
            
            if (!user.hospitalId) {
                
                return res.status(403).json({
                    success: false,
                    error: 'Hospital admin must be associated with a hospital. Please contact the super admin.'
                });
            }
            
            
            // Verify hospital exists and is active
            const Hospital = require('../models/Hospital');
            const hospital = await Hospital.findById(user.hospitalId);
            if (!hospital) {
                
                return res.status(403).json({
                    success: false,
                    error: 'Associated hospital not found. Please contact the super admin to resolve this issue.'
                });
            }
            
            // Check if hospital is inactive and activate it automatically
            if (hospital.hasOwnProperty('isActive') && !hospital.isActive) {
                
                
                // Automatically activate the hospital
                hospital.isActive = true;
                await hospital.save();
                
                
            }
            
            
            req.hospital = hospital;
        }        // For shop admin, ensure they have a valid shop association
        if (user.role === 'shop_admin') {
            
            
            // If user has no shopId, try to find an available shop or create a default association
            if (!user.shopId) {
                
                
                // Try to find an available shop without an admin
                const Shop = require('../models/Shop');
                const availableShop = await Shop.findOne({ 
                    isActive: true,
                    $or: [
                        { adminId: { $exists: false } },
                        { adminId: null }
                    ]
                });
                
                if (availableShop) {
                    
                    
                    // Update user with shopId
                    const User = require('../models/User');
                    await User.updateOne(
                        { _id: user._id },
                        { shopId: availableShop._id }
                    );
                    
                    // Update shop with adminId
                    await Shop.updateOne(
                        { _id: availableShop._id },
                        { adminId: user._id }
                    );
                    
                    user.shopId = availableShop._id;
                    req.shop = availableShop;
                    
                } else {
                    
                    return res.status(403).json({
                        success: false,
                        error: 'Shop admin must be associated with a shop. Please contact administrator.'
                    });
                }
            } else {
                
                // Verify shop exists and is active
                const Shop = require('../models/Shop');
                const shop = await Shop.findById(user.shopId);
                
                if (!shop) {
                    
                    
                    
                    // Try to find an available shop as replacement
                    const availableShop = await Shop.findOne({ 
                        isActive: true,
                        $or: [
                            { adminId: { $exists: false } },
                            { adminId: null }
                        ]
                    });
                    
                    if (availableShop) {
                        
                        
                        // Update user with new shopId
                        const User = require('../models/User');
                        await User.updateOne(
                            { _id: user._id },
                            { shopId: availableShop._id }
                        );
                        
                        // Update shop with adminId
                        await Shop.updateOne(
                            { _id: availableShop._id },
                            { adminId: user._id }
                        );
                        
                        user.shopId = availableShop._id;
                        req.shop = availableShop;
                        
                    } else {
                        
                        return res.status(403).json({
                            success: false,
                            error: 'Associated shop not found and no replacement available. Please contact administrator.'
                        });
                    }
                } else if (!shop.isActive) {
                    
                    
                    
                    // Activate the shop
                    await Shop.updateOne(
                        { _id: shop._id },
                        { isActive: true }
                    );
                    
                    shop.isActive = true;
                    req.shop = shop;
                    
                } else {
                    
                    req.shop = shop;
                }
            }
        }

        
        next();
    } catch (error) {
        console.error('❌ Role validation error:', error);
        return res.status(500).json({
            success: false,
            error: 'Server error during role validation'
        });
    }
};

// Optional middleware for rate limiting specific to authenticated users
const userRateLimit = (maxRequests = 100, windowMs = 900000) => {
    const userRequests = new Map();

    return (req, res, next) => {
        if (!req.user) {
            return next();
        }

        const userId = req.user._id.toString();
        const now = Date.now();
        const windowStart = now - windowMs;

        // Clean old entries
        if (userRequests.has(userId)) {
            const userRequestData = userRequests.get(userId);
            userRequestData.requests = userRequestData.requests.filter(time => time > windowStart);
        }

        // Initialize or get user request data
        const userRequestData = userRequests.get(userId) || { requests: [] };
        
        // Check if user has exceeded rate limit
        if (userRequestData.requests.length >= maxRequests) {
            return res.status(429).json({
                success: false,
                error: 'Too many requests, please try again later'
            });
        }

        // Add current request
        userRequestData.requests.push(now);
        userRequests.set(userId, userRequestData);

        next();
    };
};

module.exports = {
    protect,
    authorize,
    checkOwnership,
    validateUserRole,
    userRateLimit
};
