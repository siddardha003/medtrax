const express = require('express');
const Hospital = require('../models/Hospital');
const Shop = require('../models/Shop');

const router = express.Router();

// @route   GET /api/public/hospitals
// @desc    Get all active hospitals for public listing
// @access  Public
router.get('/hospitals', async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            city,
            state,
            type
        } = req.query;

        // Build filter criteria
        let filter = { isActive: true };

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { address: { $regex: search, $options: 'i' } }
            ];
        }

        if (city) {
            filter.city = { $regex: city, $options: 'i' };
        }

        if (state) {
            filter.state = { $regex: state, $options: 'i' };
        }

        if (type) {
            filter.type = type;
        }        const hospitals = await Hospital.find(filter)
            .select('name address phone contactPhone contactEmail type facilities website rating images')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ name: 1 });

        const total = await Hospital.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: {
                hospitals,
                pagination: {
                    current: page,
                    pages: Math.ceil(total / limit),
                    total
                }
            }
        });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/public/hospitals/:id
// @desc    Get hospital details by ID
// @access  Public
router.get('/hospitals/:id', async (req, res, next) => {
    try {
        const hospital = await Hospital.findById(req.params.id)
            .select('name address phone contactPhone contactEmail type facilities website description isActive rating images services');

        if (!hospital || !hospital.isActive) {
            return res.status(404).json({
                success: false,
                error: 'Hospital not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { hospital }
        });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/public/shops
// @desc    Get all active shops for public listing
// @access  Public
router.get('/shops', async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            city,
            state
        } = req.query;

        // Build filter criteria
        let filter = { isActive: true };

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { address: { $regex: search, $options: 'i' } },
                { ownerName: { $regex: search, $options: 'i' } }
            ];
        }

        if (city) {
            filter.city = { $regex: city, $options: 'i' };
        }

        if (state) {
            filter.state = { $regex: state, $options: 'i' };
        }

        const shops = await Shop.find(filter)
            .select('name address city state pincode contactPhone contactEmail ownerName services')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ name: 1 });

        const total = await Shop.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: {
                shops,
                pagination: {
                    current: page,
                    pages: Math.ceil(total / limit),
                    total
                }
            }
        });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/public/shops/:id
// @desc    Get shop details by ID
// @access  Public
router.get('/shops/:id', async (req, res, next) => {
    try {
        const shop = await Shop.findById(req.params.id)
            .select('name address city state pincode contactPhone contactEmail ownerName services description');

        if (!shop || !shop.isActive) {
            return res.status(404).json({
                success: false,
                error: 'Shop not found'
            });
        }

        res.status(200).json({
            success: true,
            data: shop
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
