const User = require('../models/User');
const Hospital = require('../models/Hospital');
const Shop = require('../models/Shop');
const { generateRandomPassword, sanitizeUser, getPaginationInfo } = require('../utils/helpers');
const { sendWelcomeEmail } = require('../utils/email');

// @desc    Create new user (Hospital Admin or Shop Admin)
// @route   POST /api/admin/create-user
// @access  Private (Super Admin only)
const createUser = async (req, res, next) => {
    try {
        const { email, firstName, lastName, role, phone, hospitalId, shopId } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'User with this email already exists'
            });
        }

        // Validate role-specific requirements
        if (role === 'hospital_admin' && !hospitalId) {
            return res.status(400).json({
                success: false,
                error: 'Hospital ID is required for hospital admin'
            });
        }

        if (role === 'shop_admin' && !shopId) {
            return res.status(400).json({
                success: false,
                error: 'Shop ID is required for shop admin'
            });
        }

        // Verify hospital or shop exists
        if (role === 'hospital_admin') {
            const hospital = await Hospital.findById(hospitalId);
            if (!hospital) {
                return res.status(404).json({
                    success: false,
                    error: 'Hospital not found'
                });
            }
            
            // Check if hospital already has an admin
            const existingAdmin = await User.findOne({ hospitalId, role: 'hospital_admin' });
            if (existingAdmin) {
                return res.status(400).json({
                    success: false,
                    error: 'Hospital already has an assigned admin'
                });
            }
        }

        if (role === 'shop_admin') {
            const shop = await Shop.findById(shopId);
            if (!shop) {
                return res.status(404).json({
                    success: false,
                    error: 'Shop not found'
                });
            }
            
            // Check if shop already has an admin
            const existingAdmin = await User.findOne({ shopId, role: 'shop_admin' });
            if (existingAdmin) {
                return res.status(400).json({
                    success: false,
                    error: 'Shop already has an assigned admin'
                });
            }
        }

        // Generate random password
        const password = generateRandomPassword();

        // Create user data
        const userData = {
            email,
            password,
            firstName,
            lastName,
            role,
            phone,
            createdBy: req.user.id
        };

        // Add role-specific fields
        if (role === 'hospital_admin') {
            userData.hospitalId = hospitalId;
        } else if (role === 'shop_admin') {
            userData.shopId = shopId;
        }

        // Create user
        const user = await User.create(userData);

        // Update hospital/shop with admin reference
        if (role === 'hospital_admin') {
            await Hospital.findByIdAndUpdate(hospitalId, { 
                adminId: user._id,
                updatedBy: req.user.id
            });
        } else if (role === 'shop_admin') {
            await Shop.findByIdAndUpdate(shopId, { 
                adminId: user._id,
                updatedBy: req.user.id
            });
        }

        // Send welcome email with credentials
        try {
            await sendWelcomeEmail(user, password);
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Don't fail the user creation if email fails
        }

        // Remove password from response
        const sanitizedUser = sanitizeUser(user);

        res.status(201).json({
            success: true,
            message: `${role.replace('_', ' ')} created successfully. Login credentials sent to email.`,
            data: {
                user: sanitizedUser
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get all users with pagination and filtering
// @route   GET /api/admin/users
// @access  Private (Super Admin only)
const getUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;
        const { role, isActive, search } = req.query;

        // Build query
        const query = {};
        
        if (role && role !== 'all') {
            query.role = role;
        }
        
        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }

        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        // Execute query with pagination
        const users = await User.find(query)
            .populate('hospitalId', 'name address.city')
            .populate('shopId', 'name address.city')
            .populate('createdBy', 'firstName lastName')
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(startIndex);

        // Get total count for pagination
        const total = await User.countDocuments(query);

        // Get pagination info
        const pagination = getPaginationInfo(page, limit, total);

        res.status(200).json({
            success: true,
            data: {
                users,
                pagination
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get single user by ID
// @route   GET /api/admin/users/:id
// @access  Private (Super Admin only)
const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
            .populate('hospitalId', 'name address type contactPerson')
            .populate('shopId', 'name address type owner')
            .populate('createdBy', 'firstName lastName email')
            .populate('updatedBy', 'firstName lastName email')
            .select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                user
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private (Super Admin only)
const updateUser = async (req, res, next) => {
    try {
        const { firstName, lastName, phone, isActive } = req.body;

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Update fields
        const updateData = {
            updatedBy: req.user.id
        };

        if (firstName !== undefined) updateData.firstName = firstName;
        if (lastName !== undefined) updateData.lastName = lastName;
        if (phone !== undefined) updateData.phone = phone;
        if (isActive !== undefined) updateData.isActive = isActive;

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        ).populate('hospitalId', 'name').populate('shopId', 'name');

        const sanitizedUser = sanitizeUser(updatedUser);

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: {
                user: sanitizedUser
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Super Admin only)
const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Don't allow deletion of super admin
        if (user.role === 'super_admin') {
            return res.status(400).json({
                success: false,
                error: 'Cannot delete super admin user'
            });
        }

        // Remove admin reference from hospital/shop
        if (user.hospitalId) {
            await Hospital.findByIdAndUpdate(user.hospitalId, { 
                adminId: null,
                updatedBy: req.user.id
            });
        }

        if (user.shopId) {
            await Shop.findByIdAndUpdate(user.shopId, { 
                adminId: null,
                updatedBy: req.user.id
            });
        }

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Register new hospital
// @route   POST /api/admin/hospitals
// @access  Private (Super Admin only)
const registerHospital = async (req, res, next) => {
    try {
        const hospitalData = {
            ...req.body,
            createdBy: req.user.id
        };

        const hospital = await Hospital.create(hospitalData);

        res.status(201).json({
            success: true,
            message: 'Hospital registered successfully',
            data: {
                hospital
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get all hospitals
// @route   GET /api/admin/hospitals
// @access  Private (Super Admin only)
const getHospitals = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;
        const { isActive, isVerified, type, search, city, state } = req.query;

        // Build query
        const query = {};
        
        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }
        
        if (isVerified !== undefined) {
            query.isVerified = isVerified === 'true';
        }
        
        if (type && type !== 'all') {
            query.type = type;
        }
        
        if (city) {
            query['address.city'] = { $regex: city, $options: 'i' };
        }
        
        if (state) {
            query['address.state'] = { $regex: state, $options: 'i' };
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { registrationNumber: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const hospitals = await Hospital.find(query)
            .populate('adminId', 'firstName lastName email')
            .populate('createdBy', 'firstName lastName')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(startIndex);

        const total = await Hospital.countDocuments(query);
        const pagination = getPaginationInfo(page, limit, total);

        res.status(200).json({
            success: true,
            data: {
                hospitals,
                pagination
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Register new medical shop
// @route   POST /api/admin/shops
// @access  Private (Super Admin only)
const registerShop = async (req, res, next) => {
    try {
        const shopData = {
            ...req.body,
            createdBy: req.user.id
        };

        const shop = await Shop.create(shopData);

        res.status(201).json({
            success: true,
            message: 'Medical shop registered successfully',
            data: {
                shop
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get all medical shops
// @route   GET /api/admin/shops
// @access  Private (Super Admin only)
const getShops = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;
        const { isActive, isVerified, type, search, city, state } = req.query;

        // Build query
        const query = {};
        
        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }
        
        if (isVerified !== undefined) {
            query.isVerified = isVerified === 'true';
        }
        
        if (type && type !== 'all') {
            query.type = type;
        }
        
        if (city) {
            query['address.city'] = { $regex: city, $options: 'i' };
        }
        
        if (state) {
            query['address.state'] = { $regex: state, $options: 'i' };
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { licenseNumber: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const shops = await Shop.find(query)
            .populate('adminId', 'firstName lastName email')
            .populate('createdBy', 'firstName lastName')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(startIndex);

        const total = await Shop.countDocuments(query);
        const pagination = getPaginationInfo(page, limit, total);

        res.status(200).json({
            success: true,
            data: {
                shops,
                pagination
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (Super Admin only)
const getDashboardStats = async (req, res, next) => {
    try {
        // Get counts
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ isActive: true });
        const hospitalAdmins = await User.countDocuments({ role: 'hospital_admin' });
        const shopAdmins = await User.countDocuments({ role: 'shop_admin' });
        
        const totalHospitals = await Hospital.countDocuments();
        const activeHospitals = await Hospital.countDocuments({ isActive: true });
        const verifiedHospitals = await Hospital.countDocuments({ isVerified: true });
        
        const totalShops = await Shop.countDocuments();
        const activeShops = await Shop.countDocuments({ isActive: true });
        const verifiedShops = await Shop.countDocuments({ isVerified: true });

        // Get recent registrations (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentUsers = await User.countDocuments({ 
            createdAt: { $gte: thirtyDaysAgo },
            role: { $ne: 'super_admin' }
        });
        const recentHospitals = await Hospital.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
        const recentShops = await Shop.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

        const stats = {
            users: {
                total: totalUsers,
                active: activeUsers,
                hospitalAdmins,
                shopAdmins,
                recent: recentUsers
            },
            hospitals: {
                total: totalHospitals,
                active: activeHospitals,
                verified: verifiedHospitals,
                recent: recentHospitals
            },
            shops: {
                total: totalShops,
                active: activeShops,
                verified: verifiedShops,
                recent: recentShops
            }
        };

        res.status(200).json({
            success: true,
            data: {
                stats
            }
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    createHospital: registerHospital,
    getHospitals,
    getHospital: getHospitals, // This needs to be implemented
    updateHospital: updateUser, // Placeholder - needs implementation
    deleteHospital: deleteUser, // Placeholder - needs implementation
    createShop: registerShop,
    getShops,
    getShop: getShops, // This needs to be implemented
    updateShop: updateUser, // Placeholder - needs implementation
    deleteShop: deleteUser, // Placeholder - needs implementation
    getSystemStats: getDashboardStats,
    getUserStats: getDashboardStats // Placeholder - needs implementation
};
