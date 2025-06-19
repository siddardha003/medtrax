const Inventory = require('../models/Inventory');
const Order = require('../models/Order');
const Shop = require('../models/Shop');
const { getPaginationInfo, generateUniqueId } = require('../utils/helpers');
const { sendOrderInvoice } = require('../utils/email');

// @desc    Get all inventory items for a shop
// @route   GET /api/shop/inventory
// @access  Private (Shop Admin)
const getInventory = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, status, search, lowStock, expiring } = req.query;
        const shopId = req.user.shopId;

        // Build query
        const query = { shopId };

        // Add filters
        if (category) query.category = category;
        if (status) query.status = status;
        if (lowStock === 'true') query.isLowStock = true;
        if (expiring === 'true') {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 30);
            query.expiryDate = { $lte: futureDate, $gt: new Date() };
        }

        // Add search functionality
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { genericName: { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } },
                { manufacturer: { $regex: search, $options: 'i' } },
                { sku: { $regex: search, $options: 'i' } },
                { batchNumber: { $regex: search, $options: 'i' } }
            ];
        }

        // Calculate pagination
        const total = await Inventory.countDocuments(query);
        const pagination = getPaginationInfo(page, limit, total);

        // Get inventory items
        const items = await Inventory.find(query)
            .sort({ name: 1 })
            .skip(pagination.startIndex)
            .limit(pagination.itemsPerPage)
            .lean();

        res.status(200).json({
            success: true,
            message: 'Inventory retrieved successfully',
            data: {
                items,
                pagination
            }
        });

    } catch (error) {
        console.error('Get inventory error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Get single inventory item
// @route   GET /api/shop/inventory/:id
// @access  Private (Shop Admin)
const getInventoryItem = async (req, res) => {
    try {
        const itemId = req.params.id;
        const shopId = req.user.shopId;

        const item = await Inventory.findOne({
            _id: itemId,
            shopId
        });

        if (!item) {
            return res.status(404).json({
                success: false,
                error: 'Inventory item not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Inventory item retrieved successfully',
            data: { item }
        });

    } catch (error) {
        console.error('Get inventory item error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Add new inventory item
// @route   POST /api/shop/inventory
// @access  Private (Shop Admin)
const addInventoryItem = async (req, res) => {
    try {
        const shopId = req.user.shopId;
        const itemData = {
            ...req.body,
            shopId,
            createdBy: req.user._id
        };

        // Generate SKU if not provided
        if (!itemData.sku) {
            itemData.sku = generateUniqueId('SKU', 6);
        }

        // Create inventory item
        const item = await Inventory.create(itemData);

        res.status(201).json({
            success: true,
            message: 'Inventory item added successfully',
            data: { item }
        });

    } catch (error) {
        console.error('Add inventory item error:', error);
        
        // Handle duplicate key error
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({
                success: false,
                error: `${field} already exists`
            });
        }

        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Update inventory item
// @route   PUT /api/shop/inventory/:id
// @access  Private (Shop Admin)
const updateInventoryItem = async (req, res) => {
    try {
        const itemId = req.params.id;
        const shopId = req.user.shopId;
        const updateData = { ...req.body, updatedBy: req.user._id };

        // Remove fields that shouldn't be updated directly
        delete updateData.shopId;
        delete updateData.createdBy;

        const item = await Inventory.findOneAndUpdate(
            { _id: itemId, shopId },
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                error: 'Inventory item not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Inventory item updated successfully',
            data: { item }
        });

    } catch (error) {
        console.error('Update inventory item error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Delete inventory item
// @route   DELETE /api/shop/inventory/:id
// @access  Private (Shop Admin)
const deleteInventoryItem = async (req, res) => {
    try {
        const itemId = req.params.id;
        const shopId = req.user.shopId;

        const item = await Inventory.findOneAndDelete({
            _id: itemId,
            shopId
        });

        if (!item) {
            return res.status(404).json({
                success: false,
                error: 'Inventory item not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Inventory item deleted successfully',
            data: {}
        });

    } catch (error) {
        console.error('Delete inventory item error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Update stock quantity
// @route   PUT /api/shop/inventory/:id/stock
// @access  Private (Shop Admin)
const updateStock = async (req, res) => {
    try {
        const itemId = req.params.id;
        const shopId = req.user.shopId;
        const { quantity, operation = 'set' } = req.body;

        const item = await Inventory.findOne({
            _id: itemId,
            shopId
        });

        if (!item) {
            return res.status(404).json({
                success: false,
                error: 'Inventory item not found'
            });
        }

        // Update stock using the model method
        await item.updateStock(quantity, operation);

        res.status(200).json({
            success: true,
            message: 'Stock updated successfully',
            data: { 
                item,
                previousQuantity: operation === 'set' ? null : 
                    operation === 'add' ? item.quantity.current - quantity : 
                    item.quantity.current + quantity,
                newQuantity: item.quantity.current
            }
        });

    } catch (error) {
        console.error('Update stock error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Get low stock items
// @route   GET /api/shop/inventory/alerts/low-stock
// @access  Private (Shop Admin)
const getLowStockItems = async (req, res) => {
    try {
        const shopId = req.user.shopId;

        const items = await Inventory.findLowStock(shopId);

        res.status(200).json({
            success: true,
            message: 'Low stock items retrieved successfully',
            data: { 
                items,
                count: items.length
            }
        });

    } catch (error) {
        console.error('Get low stock items error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Get expiring items
// @route   GET /api/shop/inventory/alerts/expiring
// @access  Private (Shop Admin)
const getExpiringItems = async (req, res) => {
    try {
        const shopId = req.user.shopId;
        const { days = 30 } = req.query;

        const items = await Inventory.findExpiring(shopId, parseInt(days));

        res.status(200).json({
            success: true,
            message: 'Expiring items retrieved successfully',
            data: { 
                items,
                count: items.length,
                daysRange: parseInt(days)
            }
        });

    } catch (error) {
        console.error('Get expiring items error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Create new order
// @route   POST /api/shop/orders
// @access  Private (Shop Admin)
const createOrder = async (req, res) => {
    try {
        const shopId = req.user.shopId;
        const orderData = {
            ...req.body,
            shopId,
            createdBy: req.user._id
        };

        // Validate inventory and update stock
        for (const item of orderData.items) {
            const inventoryItem = await Inventory.findOne({
                _id: item.productId,
                shopId
            });

            if (!inventoryItem) {
                return res.status(400).json({
                    success: false,
                    error: `Product ${item.name} not found in inventory`
                });
            }

            if (inventoryItem.quantity.current < item.quantity) {
                return res.status(400).json({
                    success: false,
                    error: `Insufficient stock for ${item.name}. Available: ${inventoryItem.quantity.current}`
                });
            }

            // Update item details from inventory
            item.name = inventoryItem.name;
            item.sku = inventoryItem.sku;
            item.batchNumber = inventoryItem.batchNumber;
            item.unit = inventoryItem.unit;
            item.expiryDate = inventoryItem.expiryDate;
            item.prescriptionRequired = inventoryItem.prescriptionRequired;
            
            // Set pricing if not provided
            if (!item.pricing.unitPrice) {
                item.pricing = {
                    unitPrice: inventoryItem.pricing.sellingPrice,
                    mrp: inventoryItem.pricing.mrp,
                    discount: item.pricing.discount || 0,
                    gstRate: inventoryItem.pricing.gstRate
                };
            }
        }

        // Create order
        const order = await Order.create(orderData);

        // Calculate totals
        order.calculateTotals();
        await order.save();

        // Update inventory quantities
        for (const item of order.items) {
            await Inventory.findByIdAndUpdate(
                item.productId,
                { $inc: { 'quantity.current': -item.quantity } }
            );
        }

        // Populate shop data
        await order.populate('shopId', 'name address phone email');

        // Send invoice email if customer email is provided
        if (order.customer.email) {
            try {
                await sendOrderInvoice({
                    customer: order.customer,
                    orderNumber: order.orderNumber,
                    items: order.items,
                    totals: order.totals,
                    shop: order.shopId
                });
            } catch (emailError) {
                console.error('Failed to send invoice email:', emailError);
                // Continue without failing the order creation
            }
        }

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: { order }
        });

    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Get all orders
// @route   GET /api/shop/orders
// @access  Private (Shop Admin)
const getOrders = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, paymentStatus, startDate, endDate, search } = req.query;
        const shopId = req.user.shopId;

        // Build query
        const query = { shopId };

        // Add filters
        if (status) query.status = status;
        if (paymentStatus) query['payment.status'] = paymentStatus;
        
        // Date range filter
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) {
                const endDateObj = new Date(endDate);
                endDateObj.setHours(23, 59, 59, 999);
                query.createdAt.$lte = endDateObj;
            }
        }

        // Add search functionality
        if (search) {
            query.$or = [
                { orderNumber: { $regex: search, $options: 'i' } },
                { invoiceNumber: { $regex: search, $options: 'i' } },
                { 'customer.firstName': { $regex: search, $options: 'i' } },
                { 'customer.lastName': { $regex: search, $options: 'i' } },
                { 'customer.phone': { $regex: search, $options: 'i' } }
            ];
        }

        // Calculate pagination
        const total = await Order.countDocuments(query);
        const pagination = getPaginationInfo(page, limit, total);

        // Get orders
        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .skip(pagination.startIndex)
            .limit(pagination.itemsPerPage)
            .populate('shopId', 'name address')
            .lean();

        res.status(200).json({
            success: true,
            message: 'Orders retrieved successfully',
            data: {
                orders,
                pagination
            }
        });

    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Get single order
// @route   GET /api/shop/orders/:id
// @access  Private (Shop Admin)
const getOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const shopId = req.user.shopId;

        const order = await Order.findOne({
            _id: orderId,
            shopId
        }).populate('shopId', 'name address phone email')
          .populate('items.productId', 'name genericName manufacturer');

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Order retrieved successfully',
            data: { order }
        });

    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Update order status
// @route   PUT /api/shop/orders/:id/status
// @access  Private (Shop Admin)
const updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const shopId = req.user.shopId;
        const { status, notes } = req.body;

        const order = await Order.findOneAndUpdate(
            { _id: orderId, shopId },
            { 
                status,
                updatedBy: req.user._id,
                ...(notes && { notes })
            },
            { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            data: { order }
        });

    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Get shop sales statistics
// @route   GET /api/shop/stats
// @access  Private (Shop Admin)
const getShopStats = async (req, res) => {
    try {
        const shopId = req.user.shopId;
        const { period = 'month' } = req.query;

        // Calculate date range
        const now = new Date();
        let startDate = new Date();

        switch (period) {
            case 'today':
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'week':
                startDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(now.getMonth() - 1);
                break;
            case 'year':
                startDate.setFullYear(now.getFullYear() - 1);
                break;
            default:
                startDate.setMonth(now.getMonth() - 1);
        }

        // Get sales statistics
        const salesStats = await Order.getSalesSummary(shopId, startDate, now);

        // Get inventory statistics
        const inventoryStats = await Inventory.aggregate([
            { $match: { shopId: shopId } },
            {
                $group: {
                    _id: null,
                    totalProducts: { $sum: 1 },
                    totalStock: { $sum: '$quantity.current' },
                    lowStockItems: { $sum: { $cond: ['$isLowStock', 1, 0] } },
                    expiredItems: { $sum: { $cond: ['$isExpired', 1, 0] } },
                    totalStockValue: { 
                        $sum: { 
                            $multiply: ['$quantity.current', '$pricing.costPrice'] 
                        } 
                    }
                }
            }
        ]);

        // Get top selling categories
        const topCategories = await Order.aggregate([
            { $match: { shopId: shopId, createdAt: { $gte: startDate } } },
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'inventories',
                    localField: 'items.productId',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $group: {
                    _id: '$product.category',
                    totalSold: { $sum: '$items.quantity' },
                    totalRevenue: { $sum: '$items.pricing.totalAmount' }
                }
            },
            { $sort: { totalRevenue: -1 } },
            { $limit: 5 }
        ]);

        res.status(200).json({
            success: true,
            message: 'Shop statistics retrieved successfully',
            data: {
                sales: salesStats[0] || {
                    totalOrders: 0,
                    totalRevenue: 0,
                    totalDiscount: 0,
                    averageOrderValue: 0
                },
                inventory: inventoryStats[0] || {
                    totalProducts: 0,
                    totalStock: 0,
                    lowStockItems: 0,
                    expiredItems: 0,
                    totalStockValue: 0
                },
                topCategories,
                period,
                dateRange: { startDate, endDate: now }
            }
        });

    } catch (error) {
        console.error('Get shop stats error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

module.exports = {
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
    getShopStats
};
