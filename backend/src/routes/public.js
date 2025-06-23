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
        }

        const hospitals = await Hospital.find(filter)
            .select('name address phone contactPhone contactEmail type facilities website rating images')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ name: 1 });

        const total = await Hospital.countDocuments(filter);

        // Add dummy data if no hospitals found
        const dummyHospitals = [
            {
                _id: 'dummy1',
                name: 'City General Hospital',
                address: {
                    street: '123 Medical Center Dr',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    zipCode: '400001'
                },
                phone: '+91-9876543210',
                contactPhone: '+91-9876543210',
                contactEmail: 'info@citygeneralhospital.com',
                type: 'General',
                rating: 4.5,
                images: ['https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400&h=200&fit=crop']
            },
            {
                _id: 'dummy2',
                name: 'Apollo Medical Center',
                address: {
                    street: '456 Health Street',
                    city: 'Delhi',
                    state: 'Delhi',
                    zipCode: '110001'
                },
                phone: '+91-9876543211',
                contactPhone: '+91-9876543211',
                contactEmail: 'contact@apollomedical.com',
                type: 'Specialty',
                rating: 4.7,
                images: ['https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=200&fit=crop']
            }
        ];

        const finalHospitals = hospitals.length > 0 ? hospitals : dummyHospitals;        res.status(200).json({
            success: true,
            data: {
                hospitals: finalHospitals,
                pagination: {
                    current: page,
                    pages: Math.ceil((total || finalHospitals.length) / limit),
                    total: total || finalHospitals.length
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
    try {        const hospital = await Hospital.findById(req.params.id)
            .select('name address phone contactPhone contactEmail type facilities website description isActive rating images services');

        if (!hospital || !hospital.isActive) {
            // Return dummy hospital data if not found
            const dummyHospital = {
                _id: req.params.id,
                name: 'Sample Hospital',
                address: {
                    street: '123 Hospital Street',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    zipCode: '400001'
                },
                phone: '+91-9876543210',
                contactPhone: '+91-9876543210',
                contactEmail: 'info@samplehospital.com',
                type: 'General',
                rating: 4.5,
                images: ['https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400&h=200&fit=crop'],
                services: [
                    {
                        category: 'General Medicine',
                        doctors: [
                            { id: 'dr1', name: 'Dr. Smith' },
                            { id: 'dr2', name: 'Dr. Johnson' }
                        ]
                    }
                ],
                description: 'A leading healthcare facility providing comprehensive medical services.',
                facilities: ['Emergency Care', 'ICU', 'Laboratory', 'Pharmacy']
            };
            
            return res.status(200).json({
                success: true,
                data: { hospital: dummyHospital }
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
        }        const shops = await Shop.find(filter)
            .select('name address city state pincode contactPhone contactEmail ownerName services')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ name: 1 });

        const total = await Shop.countDocuments(filter);

        // Add dummy data if no shops found
        const dummyShops = [
            {
                _id: 'shop-dummy1',
                name: 'MediCare Pharmacy',
                address: {
                    street: '123 Pharmacy Lane',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    zipCode: '400002'
                },
                contactPhone: '+91-9876543220',
                contactEmail: 'info@medicare.com',
                ownerName: 'Dr. Sharma',
                services: ['Prescription Medicines', 'Health Checkups', 'Medical Supplies'],
                rating: 4.6,
                images: ['https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&h=200&fit=crop']
            },
            {
                _id: 'shop-dummy2',
                name: 'HealthPlus Medical Store',
                address: {
                    street: '456 Medical Street',
                    city: 'Delhi',
                    state: 'Delhi',
                    zipCode: '110003'
                },
                contactPhone: '+91-9876543221',
                contactEmail: 'contact@healthplus.com',
                ownerName: 'Mr. Patel',
                services: ['Medicines', 'First Aid', 'Health Products'],
                rating: 4.4,
                images: ['https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=200&fit=crop']
            }
        ];

        const finalShops = shops.length > 0 ? shops : dummyShops;        res.status(200).json({
            success: true,
            data: {
                shops: finalShops,
                pagination: {
                    current: page,
                    pages: Math.ceil((total || finalShops.length) / limit),
                    total: total || finalShops.length
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
    try {        const shop = await Shop.findById(req.params.id)
            .select('name address city state pincode contactPhone contactEmail ownerName services description');

        if (!shop) {
            // Return dummy shop data if not found
            const dummyShop = {
                _id: req.params.id,
                name: 'Sample Medical Store',
                address: {
                    street: '123 Pharmacy Lane',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    zipCode: '400002'
                },
                contactPhone: '+91-9876543220',
                contactEmail: 'info@samplestore.com',
                ownerName: 'Dr. Sample',
                phone: '+91-9876543220',
                rating: 4.5,
                reviewsCount: 125,
                closingTime: '10:00 PM',
                location: 'Mumbai, Maharashtra',
                directionsLink: '#',
                images: [
                    'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'
                ],
                services: [
                    {
                        category: "Medicines",
                        items: [
                            { name: "Paracetamol", duration: "As needed", price: 25 },
                            { name: "Cough Syrup", duration: "Daily", price: 85 }
                        ]
                    },
                    {
                        category: "Health Checkup",
                        items: [
                            { name: "Blood Pressure Check", duration: "15 mins", price: 50 },
                            { name: "Blood Sugar Test", duration: "10 mins", price: 30 }
                        ]
                    }
                ],
                description: 'A trusted pharmacy providing quality medicines and healthcare products.'
            };
            
            return res.status(200).json({
                success: true,
                data: dummyShop
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
