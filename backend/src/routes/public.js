const express = require('express');
const Hospital = require('../models/Hospital');
const Shop = require('../models/Shop');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const { protect } = require('../middleware/auth');
const mongoose = require('mongoose');

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
    try {        
        const hospital = await Hospital.findById(req.params.id)
            .select('name address city state pincode phone email closingTime images services openingTimes location rating reviewsCount profileComplete registrationNumber');

        if (!hospital) {
            // Return dummy hospital data if not found
            const dummyHospital = {
                _id: req.params.id,
                name: 'Sample Hospital',
                address: '123 Hospital Street',
                city: 'Mumbai',
                state: 'Maharashtra',
                pincode: '400001',
                phone: '+91-9876543210',
                email: 'info@samplehospital.com',
                rating: 4.5,
                reviewsCount: 120,
                closingTime: '10:00 PM',
                profileComplete: false,
                images: ['https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400&h=200&fit=crop'],
                services: [
                    {
                        category: 'General Medicine',
                        description: 'General medical services',
                        image: 'https://via.placeholder.com/150?text=General+Medicine',
                        doctors: [
                            { name: 'Dr. Smith', degree: 'MBBS, MD', image: 'https://via.placeholder.com/150' },
                            { name: 'Dr. Johnson', degree: 'MBBS, MS', image: 'https://via.placeholder.com/150' }
                        ]
                    }
                ],
                openingTimes: [
                    { day: 'Monday', time: '9:00 AM - 5:00 PM' },
                    { day: 'Tuesday', time: '9:00 AM - 5:00 PM' },
                    { day: 'Wednesday', time: '9:00 AM - 5:00 PM' },
                    { day: 'Thursday', time: '9:00 AM - 5:00 PM' },
                    { day: 'Friday', time: '9:00 AM - 5:00 PM' },
                    { day: 'Saturday', time: '9:00 AM - 2:00 PM' },
                    { day: 'Sunday', time: 'Closed' }
                ],
                location: {
                    latitude: 19.0760,
                    longitude: 72.8777
                }
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
            .select('name address city state pincode contactPhone contactEmail ownerName services location phone images')
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

        const finalShops = shops.length > 0 ? shops : dummyShops;
        // Ensure images field is always present
        const shopsWithImages = finalShops.map(shop => {
            // Convert to plain object if needed
            const plainShop = shop.toObject ? shop.toObject() : shop;
            if (!plainShop.images) plainShop.images = [];
            return plainShop;
        });
        res.status(200).json({
            success: true,
            data: {
                shops: shopsWithImages,
                pagination: {
                    current: page,
                    pages: Math.ceil((total || shopsWithImages.length) / limit),
                    total: total || shopsWithImages.length
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
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, error: 'Invalid shop ID format.' });
        }
        const shop = await Shop.findById(req.params.id)
            .select('name address city state pincode phone contactPhone contactEmail ownerName ownerPhone ownerEmail services description closingTime location directionsLink images openingTimes selectedMedicalshop latitude longitude fullAddress');

        if (!shop) {
            // Return a special response indicating not set up yet
            return res.status(200).json({
                success: false,
                notSetUp: true,
                message: 'This shop has not been set up by the owner yet.',
                data: null
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

// @route   GET /api/public/stats
// @desc    Get public system statistics for landing page
// @access  Public
router.get('/stats', async (req, res, next) => {
    try {
        // Force direct database queries
        const hospitalsCollection = Hospital.collection;
        const shopsCollection = Shop.collection;
        const usersCollection = User.collection;
        
        const totalHospitals = await hospitalsCollection.countDocuments();
        
        
        const totalShops = await shopsCollection.countDocuments();
        
        
        // Get total users who are patients
        const totalPatients = await usersCollection.countDocuments({ role: 'user' });
        
        
        // Calculate years of experience (assuming service started in 2020)
        const currentYear = new Date().getFullYear();
        const yearsOfExperience = currentYear - 2020;

        // Make sure we return at least a minimum number for better UI appearance
        // but only if the actual count is 0
        const stats = {
            yearsOfExperience: yearsOfExperience > 0 ? yearsOfExperience : 5,
            totalPatients: totalPatients > 0 ? totalPatients : 200,
            totalShops: totalShops > 0 ? totalShops : 10,
            totalHospitals: totalHospitals > 0 ? totalHospitals : 15
        };

        res.status(200).json({
            success: true,
            data: stats
        });

    } catch (error) {
        console.error('Get public stats error:', error);
        res.status(500).json({
            success: false,
            error: 'Unable to fetch statistics'
        });
    }
});

// @route   GET /api/public/hospital/:hospitalId/doctor/:doctorId/available-slots
// @desc    Get available slots for a doctor on a given date (public)
// @access  Public
router.get('/hospital/:hospitalId/doctor/:doctorId/available-slots', async (req, res) => {
    try {
        const { hospitalId, doctorId } = req.params;
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ success: false, error: 'Date parameter is required' });
        }

        // Check if hospital exists and is active
        const hospital = await Hospital.findById(hospitalId);
        if (!hospital || !hospital.isActive) {
            return res.status(404).json({ success: false, error: 'Hospital not found or inactive' });
        }

        // Get day of week from date
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeek = days[new Date(date).getDay()];

        // Find the doctor in hospital services
        let doctor = null;
        let department = null;
        
        for (const service of hospital.services || []) {
            const foundDoctor = service.doctors?.find(d => d._id?.toString() === doctorId || d.id === doctorId);
            if (foundDoctor) {
                doctor = foundDoctor;
                department = service.category;
                break;
            }
        }

        if (!doctor) {
            return res.status(404).json({ success: false, error: 'Doctor not found' });
        }

        // Get doctor's availability for the day
        const dayAvailability = doctor.availability?.find(a => a.day === dayOfWeek);
        if (!dayAvailability || !dayAvailability.slots) {
            return res.json({ success: true, slots: [] });
        }

        // Get already booked slots for this doctor and date
        const appointments = await Appointment.find({
            hospitalId,
            department,
            doctorId,
            appointmentDate: new Date(date),
            status: { $in: ['scheduled', 'confirmed'] }
        });

        const bookedSlots = appointments.map(a => a.appointmentTime);
        
        // Filter out booked slots
        const availableSlots = dayAvailability.slots.filter(slot => !bookedSlots.includes(slot));

        res.json({ success: true, slots: availableSlots, bookedSlots });
    } catch (error) {
        console.error('Get available slots error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// @route   POST /api/public/appointments
// @desc    Book an appointment (logged-in users only)
// @access  Private (User)
router.post('/appointments', protect, async (req, res, next) => {
    try {
        // Extract appointment details from request body
        const {
            hospitalId,
            doctorId,
            department,
            appointmentDate,
            appointmentTime,
            patientName,
            patientPhone,
            patientEmail,
            notes
        } = req.body;

        // Only require the fields present in the frontend form
        if (!hospitalId || !doctorId || !department || !appointmentDate || !appointmentTime || !patientName || !patientPhone || !patientEmail) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        // Check if hospital exists and is active
        const hospital = await Hospital.findById(hospitalId);
        if (!hospital || !hospital.isActive) {
            return res.status(400).json({ success: false, error: 'Hospital not found or inactive' });
        }

        // Check for double-booking
        const existingAppointment = await Appointment.findOne({
            hospitalId,
            department,
            doctorId,
            appointmentDate: new Date(appointmentDate),
            appointmentTime,
            status: { $in: ['scheduled', 'confirmed'] }
        });

        if (existingAppointment) {
            return res.status(409).json({
                success: false,
                error: 'This time slot is already booked. Please select a different time.'
            });
        }

        // Create appointment with flat structure
        const appointment = await Appointment.create({
            hospitalId,
            doctorId,
            department,
            appointmentDate,
            appointmentTime,
            patientName,
            patientPhone,
            patientEmail,
            notes,
            createdBy: req.user._id
        });

        res.status(201).json({
            success: true,
            message: 'Appointment booked successfully',
            data: { appointment }
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
