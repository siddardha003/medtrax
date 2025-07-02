const express = require('express');
const {
    getInventory,
    getInventoryItem,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    updateStock,
    getLowStockItems,
    getExpiringItems,
    createOrder,
    getOrders,
    getOrder,
    updateOrderStatus,
    getShopStats,
    getShopProfile,
    updateShopProfile,
    updateShopStatus,
    uploadShopImage,
    debugShopAccess
} = require('../controllers/shopController');

const { protect, authorize, validateUserRole } = require('../middleware/auth');
const {
    validateInventoryItem,
    validateOrderCreation,
    validateObjectId,
    validatePagination,
    validateDateRange,
    handleValidationErrors
} = require('../middleware/validation');
const { body, query } = require('express-validator');

const router = express.Router();

// Debug route (place before middleware to avoid role restrictions)
router.get('/debug/access', protect, debugShopAccess);

// Protect all routes - only shop admins can access
router.use(protect);
router.use(authorize('shop_admin'));
router.use(validateUserRole);

// Inventory Management Routes

// @route   GET /api/shop/inventory
// @desc    Get all inventory items for the shop
// @access  Private (Shop Admin only)
router.get('/inventory', [
    validatePagination,
    query('category')
        .optional()
        .isIn([
            'prescription_drug', 'otc_drug', 'medical_device', 'surgical_instrument',
            'health_supplement', 'baby_care', 'elderly_care', 'first_aid',
            'diagnostic_kit', 'medical_consumables', 'ayurvedic', 'homeopathic'
        ])
        .withMessage('Invalid category'),
    query('status')
        .optional()
        .isIn(['active', 'inactive', 'discontinued', 'out_of_stock'])
        .withMessage('Invalid status'),
    query('search')
        .optional()
        .isLength({ min: 2 })
        .withMessage('Search query must be at least 2 characters'),
    query('lowStock')
        .optional()
        .isBoolean()
        .withMessage('lowStock must be a boolean'),
    query('expiring')
        .optional()
        .isBoolean()
        .withMessage('expiring must be a boolean'),
    handleValidationErrors
], getInventory);

// @route   GET /api/shop/inventory/alerts/low-stock
// @desc    Get low stock items
// @access  Private (Shop Admin only)
router.get('/inventory/alerts/low-stock', getLowStockItems);

// @route   GET /api/shop/inventory/alerts/expiring
// @desc    Get expiring items
// @access  Private (Shop Admin only)
router.get('/inventory/alerts/expiring', [
    query('days')
        .optional()
        .isInt({ min: 1, max: 365 })
        .withMessage('Days must be between 1 and 365'),
    handleValidationErrors
], getExpiringItems);

// @route   GET /api/shop/inventory/:id
// @desc    Get single inventory item by ID
// @access  Private (Shop Admin only)
router.get('/inventory/:id', validateObjectId('id'), getInventoryItem);

// @route   POST /api/shop/inventory
// @desc    Add new inventory item
// @access  Private (Shop Admin only)
router.post('/inventory', validateInventoryItem, addInventoryItem);

// @route   PUT /api/shop/inventory/:id
// @desc    Update inventory item details
// @access  Private (Shop Admin only)
router.put('/inventory/:id', [
    validateObjectId('id'),
    body('name')
        .optional()
        .isLength({ min: 2, max: 200 })
        .trim()
        .withMessage('Product name must be between 2 and 200 characters'),
    body('manufacturer')
        .optional()
        .notEmpty()
        .trim()
        .withMessage('Manufacturer is required'),
    body('category')
        .optional()
        .isIn([
            'prescription_drug', 'otc_drug', 'medical_device', 'surgical_instrument',
            'health_supplement', 'baby_care', 'elderly_care', 'first_aid',
            'diagnostic_kit', 'medical_consumables', 'ayurvedic', 'homeopathic'
        ])
        .withMessage('Invalid category'),
    body('status')
        .optional()
        .isIn(['active', 'inactive', 'discontinued', 'out_of_stock'])
        .withMessage('Invalid status'),
    body('pricing.costPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Cost price must be a non-negative number'),
    body('pricing.sellingPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Selling price must be a non-negative number'),
    body('pricing.mrp')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('MRP must be a non-negative number'),
    body('quantity.minimum')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Minimum quantity must be a non-negative integer'),
    handleValidationErrors
], updateInventoryItem);

// @route   PUT /api/shop/inventory/:id/stock
// @desc    Update stock quantity
// @access  Private (Shop Admin only)
router.put('/inventory/:id/stock', [
    validateObjectId('id'),
    body('quantity')
        .isInt({ min: 0 })
        .withMessage('Quantity must be a non-negative integer'),
    body('operation')
        .optional()
        .isIn(['set', 'add', 'subtract'])
        .withMessage('Operation must be set, add, or subtract'),
    handleValidationErrors
], updateStock);

// @route   DELETE /api/shop/inventory/:id
// @desc    Delete inventory item
// @access  Private (Shop Admin only)
router.delete('/inventory/:id', validateObjectId('id'), deleteInventoryItem);

// Order Management Routes

// @route   GET /api/shop/orders
// @desc    Get all orders for the shop
// @access  Private (Shop Admin only)
router.get('/orders', [
    validatePagination,
    validateDateRange,
    query('status')
        .optional()
        .isIn(['pending', 'processing', 'ready', 'delivered', 'cancelled', 'returned'])
        .withMessage('Invalid status'),
    query('paymentStatus')
        .optional()
        .isIn(['pending', 'partial', 'paid', 'failed', 'refunded'])
        .withMessage('Invalid payment status'),
    query('search')
        .optional()
        .isLength({ min: 2 })
        .withMessage('Search query must be at least 2 characters'),
    handleValidationErrors
], getOrders);

// @route   GET /api/shop/orders/:id
// @desc    Get single order by ID
// @access  Private (Shop Admin only)
router.get('/orders/:id', validateObjectId('id'), getOrder);

// @route   POST /api/shop/orders
// @desc    Create new order
// @access  Private (Shop Admin only)
router.post('/orders', validateOrderCreation, createOrder);

// @route   PUT /api/shop/orders/:id/status
// @desc    Update order status
// @access  Private (Shop Admin only)
router.put('/orders/:id/status', [
    validateObjectId('id'),
    body('status')
        .isIn(['pending', 'processing', 'ready', 'delivered', 'cancelled', 'returned'])
        .withMessage('Invalid status'),
    body('notes')
        .optional()
        .isLength({ max: 500 })
        .trim()
        .withMessage('Notes cannot exceed 500 characters'),
    handleValidationErrors
], updateOrderStatus);

// Statistics Routes

// @route   GET /api/shop/stats
// @desc    Get shop statistics
// @access  Private (Shop Admin only)
router.get('/stats', [
    query('period')
        .optional()
        .isIn(['today', 'week', 'month', 'year'])
        .withMessage('Invalid period'),
    handleValidationErrors
], getShopStats);

// Shop Profile Routes

// @route   POST /api/shop/profile/upload-image
// @desc    Upload shop image
// @access  Private (Shop Admin only)
router.post('/profile/upload-image', uploadShopImage);

// @route   GET /api/shop/profile
// @desc    Get shop profile
// @access  Private (Shop Admin only)
router.get('/profile', getShopProfile);

// @route   PUT /api/shop/profile
// @desc    Update shop profile
// @access  Private (Shop Admin only)
router.put('/profile', [
    body('name')
        .optional()
        .isLength({ min: 2, max: 100 })
        .trim()
        .withMessage('Name must be between 2 and 100 characters'),
    body('address')
        .optional()
        .isLength({ min: 5, max: 200 })
        .trim()
        .withMessage('Address must be between 5 and 200 characters'),
    body('pincode')
        .optional()
        .isLength({ min: 5, max: 10 })
        .trim()
        .withMessage('Pincode must be between 5 and 10 characters'),
    body('city')
        .optional()
        .isLength({ min: 2, max: 50 })
        .trim()
        .withMessage('City must be between 2 and 50 characters'),
    body('state')
        .optional()
        .isLength({ min: 2, max: 50 })
        .trim()
        .withMessage('State must be between 2 and 50 characters'),
    body('phone')
        .optional()
        .isLength({ min: 10, max: 15 })
        .trim()
        .withMessage('Phone must be between 10 and 15 characters'),
    body('email')
        .optional()
        .isEmail()
        .trim()
        .normalizeEmail()
        .withMessage('Invalid email format'),
    handleValidationErrors
], updateShopProfile);

// @route   PATCH /api/shop/status
// @desc    Update shop status (active/inactive)
// @access  Private (Shop Admin only)
router.patch('/status', [
    body('isActive')
        .isBoolean()
        .withMessage('isActive must be a boolean'),
    handleValidationErrors
], updateShopStatus);

module.exports = router;
