const Appointment = require('../models/Appointment');
const Hospital = require('../models/Hospital');
const { getPaginationInfo } = require('../utils/helpers');
const { sendAppointmentConfirmation } = require('../utils/email');
const { localUpload, uploadToCloudinary } = require('../utils/fileUpload');

// @desc    Get all appointments for a hospital
// @route   GET /api/hospital/appointments
// @access  Private (Hospital Admin)
const getAppointments = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, department, date, search } = req.query;
        const hospitalId = req.user.hospitalId;

        // Build query
        const query = { hospitalId };

        // Add filters
        if (status) query.status = status;
        if (department) query.department = department;
        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            query.appointmentDate = { $gte: startDate, $lt: endDate };
        }

        // Add search functionality - search in flat patient fields
        if (search) {
            query.$or = [
                { patientName: { $regex: search, $options: 'i' } },
                { patientEmail: { $regex: search, $options: 'i' } },
                { patientPhone: { $regex: search, $options: 'i' } },
                { confirmationCode: { $regex: search, $options: 'i' } }
            ];
        }

        // Calculate pagination
        const total = await Appointment.countDocuments(query);
        const pagination = getPaginationInfo(page, limit, total);

        // Get appointments
        const appointments = await Appointment.find(query)
            .sort({ appointmentDate: 1, appointmentTime: 1 })
            .skip(pagination.startIndex)
            .limit(pagination.itemsPerPage)
            .populate('hospitalId', 'name address phone')
            .lean();

        res.status(200).json({
            success: true,
            message: 'Appointments retrieved successfully',
            data: {
                appointments,
                pagination: {
                    ...pagination,
                    total
                }
            }
        });

    } catch (error) {
        console.error('Get appointments error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error',
            details: error.message
        });
    }
};

// @desc    Get single appointment
// @route   GET /api/hospital/appointments/:id
// @access  Private (Hospital Admin)
const getAppointment = async (req, res) => {
    try {
        const appointmentId = req.params.id;
        const hospitalId = req.user.hospitalId;

        const appointment = await Appointment.findOne({
            _id: appointmentId,
            hospitalId
        }).populate('hospitalId', 'name address phone email');

        if (!appointment) {
            return res.status(404).json({
                success: false,
                error: 'Appointment not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Appointment retrieved successfully',
            data: { appointment }
        });

    } catch (error) {
        console.error('Get appointment error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Create a new appointment
// @route   POST /api/hospital/appointments
// @access  Private (Hospital Admin)
const createAppointment = async (req, res) => {
    try {
        const hospitalId = req.user.hospitalId;
        const {
            patientName,
            patientEmail,
            patientPhone,
            department,
            doctorId,
            appointmentDate,
            appointmentTime,
            notes
        } = req.body;

        // Validate required fields
        if (!patientName || !patientEmail || !patientPhone || !department || !doctorId || !appointmentDate || !appointmentTime) {
            return res.status(400).json({
                success: false,
                error: 'All required fields must be provided'
            });
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

        // Create the appointment
        const appointment = await Appointment.create({
            hospitalId,
            patientName,
            patientEmail,
            patientPhone,
            department,
            doctorId,
            appointmentDate: new Date(appointmentDate),
            appointmentTime,
            notes,
            status: 'scheduled',
            createdBy: req.user._id
        });

        // Populate hospital details
        await appointment.populate('hospitalId', 'name address phone');

        res.status(201).json({
            success: true,
            message: 'Appointment created successfully',
            data: { appointment }
        });

    } catch (error) {
        console.error('Create appointment error:', error);
        
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                error: 'Validation error',
                details: errors
            });
        }
        
        res.status(500).json({
            success: false,
            error: 'Server error',
            details: error.message
        });
    }
};

// @desc    Update appointment
// @route   PUT /api/hospital/appointments/:id
// @access  Private (Hospital Admin)
const updateAppointment = async (req, res) => {
    try {
        const appointmentId = req.params.id;
        const hospitalId = req.user.hospitalId;
        const updateData = { ...req.body, updatedBy: req.user._id };

        // Remove fields that shouldn't be updated directly
        delete updateData.hospitalId;
        delete updateData.confirmationCode;
        delete updateData.createdBy;

        const appointment = await Appointment.findOneAndUpdate(
            { _id: appointmentId, hospitalId },
            updateData,
            {
                new: true,
                runValidators: true
            }
        ).populate('hospitalId', 'name address phone email');

        if (!appointment) {
            return res.status(404).json({
                success: false,
                error: 'Appointment not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Appointment updated successfully',
            data: { appointment }
        });

    } catch (error) {
        console.error('Update appointment error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Cancel appointment
// @route   DELETE /api/hospital/appointments/:id
// @access  Private (Hospital Admin)
const cancelAppointment = async (req, res) => {
    try {
        const appointmentId = req.params.id;
        const hospitalId = req.user.hospitalId;

        const appointment = await Appointment.findOneAndDelete({
            _id: appointmentId,
            hospitalId
        });

        if (!appointment) {
            return res.status(404).json({
                success: false,
                error: 'Appointment not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Appointment deleted successfully',
            data: { appointment }
        });
    } catch (error) {
        console.error('Cancel appointment error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Get appointment statistics
// @route   GET /api/hospital/appointments/stats
// @access  Private (Hospital Admin)
const getAppointmentStats = async (req, res) => {
    try {
        const hospitalId = req.user.hospitalId;
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Get all appointments for this hospital
        const allAppointments = await Appointment.find({ hospitalId });
        
        // Get today's appointments
        const todayAppointments = await Appointment.find({
            hospitalId,
            appointmentDate: { $gte: today, $lt: tomorrow }
        });

        // Calculate statistics
        const totalAppointments = allAppointments.length;
        const todayAppointmentsCount = todayAppointments.length;
        const completedAppointments = allAppointments.filter(apt => apt.status === 'completed').length;
        const pendingAppointments = allAppointments.filter(apt => apt.status !== 'completed').length;

        // Get department-wise statistics
        const departmentStats = await Appointment.aggregate([
            { $match: { hospitalId: hospitalId } },
            { $group: {
                _id: '$department',
                count: { $sum: 1 },
                completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
                pending: { $sum: { $cond: [{ $ne: ['$status', 'completed'] }, 1, 0] } }
            }},
            { $sort: { count: -1 } }
        ]);

        // Get monthly statistics for the current year
        const currentYear = now.getFullYear();
        const monthlyStats = await Appointment.aggregate([
            { 
                $match: { 
                    hospitalId: hospitalId,
                    appointmentDate: { 
                        $gte: new Date(currentYear, 0, 1),
                        $lt: new Date(currentYear + 1, 0, 1)
                    }
                } 
            },
            { 
                $group: {
                    _id: { $month: '$appointmentDate' },
                    count: { $sum: 1 },
                    completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const stats = {
            totalAppointments,
            todayAppointments: todayAppointmentsCount,
            pendingAppointments,
            completedAppointments,
            departmentStats,
            monthlyStats
        };

        res.status(200).json({
            success: true,
            message: 'Appointment statistics retrieved successfully',
            data: { summary: stats }
        });
    } catch (error) {
        console.error('Get appointment stats error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// @desc    Search patients
// @route   GET /api/hospital/patients/search
// @access  Private (Hospital Admin)
const searchPatients = async (req, res) => {
    try {
        const { q, limit = 10 } = req.query;
        const hospitalId = req.user.hospitalId;

        if (!q || q.length < 2) {
            return res.status(400).json({
                success: false,
                error: 'Search query must be at least 2 characters'
            });
        }

        // Search in appointments for patients using flat structure
        const patients = await Appointment.aggregate([
            {
                $match: {
                    hospitalId: hospitalId,
                    $or: [
                        { patientName: { $regex: q, $options: 'i' } },
                        { patientEmail: { $regex: q, $options: 'i' } },
                        { patientPhone: { $regex: q, $options: 'i' } }
                    ]
                }
            },
            {
                $group: {
                    _id: '$patientEmail',
                    patient: {
                        name: { $first: '$patientName' },
                        email: { $first: '$patientEmail' },
                        phone: { $first: '$patientPhone' }
                    },
                    lastVisit: { $max: '$appointmentDate' },
                    totalVisits: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    patient: 1,
                    lastVisit: 1,
                    totalVisits: 1
                }
            },
            { $limit: parseInt(limit) }
        ]);

        res.status(200).json({
            success: true,
            message: 'Patient search completed',
            data: { patients }
        });

    } catch (error) {
        console.error('Search patients error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Get hospital profile details
// @route   GET /api/hospital/profile
// @access  Private (Hospital Admin)
const getHospitalProfile = async (req, res) => {
    try {
        const hospitalId = req.user.hospitalId;
        
        
        if (!hospitalId) {
            
            return res.status(400).json({
                success: false,
                error: 'No hospital ID associated with this user'
            });
        }

        const hospital = await Hospital.findById(hospitalId).lean();
        
        if (!hospital) {
            
            return res.status(404).json({
                success: false,
                error: 'Hospital not found'
            });
        }

        
        res.status(200).json({
            success: true,
            message: 'Hospital profile retrieved successfully',
            data: { hospital }
        });

    } catch (error) {
        console.error('Get hospital profile error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error',
            details: error.message
        });
    }
};

// @desc    Update hospital profile details
// @route   PUT /api/hospital/profile
// @access  Private (Hospital Admin)
const updateHospitalProfile = async (req, res) => {
    try {
        const hospitalId = req.user.hospitalId;
        const { 
            images, 
            closingTime, 
            openingTimes, 
            services, 
            location 
        } = req.body;

        // Find hospital first
        const hospital = await Hospital.findById(hospitalId);
        
        if (!hospital) {
            return res.status(404).json({
                success: false,
                error: 'Hospital not found'
            });
        }

        // Update fields if provided
        if (images) hospital.images = images;
        if (closingTime) hospital.closingTime = closingTime;
        if (openingTimes) hospital.openingTimes = openingTimes;
        if (services) hospital.services = services;
        if (location) hospital.location = location;
        
        // Mark profile as complete if all required fields are filled
        hospital.profileComplete = Boolean(
            hospital.images?.length > 0 && 
            hospital.openingTimes?.length > 0 && 
            hospital.services?.length > 0 &&
            hospital.location?.latitude &&
            hospital.location?.longitude
        );
        
        hospital.updatedBy = req.user.id;
        
        // Save updated hospital
        await hospital.save();

        res.status(200).json({
            success: true,
            message: 'Hospital profile updated successfully',
            data: { hospital }
        });

    } catch (error) {
        console.error('Update hospital profile error:', error);
        
        // Handling validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                error: messages.join(', ')
            });
        }
        
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Upload hospital images
// @route   POST /api/hospital/profile/upload-image
// @access  Private (Hospital Admin)
const uploadHospitalImage = async (req, res) => {
    try {
        const { upload } = require('../utils/cloudinary');
        
        upload.single('image')(req, res, async function(err) {
            if (err) {
                console.error('Cloudinary upload middleware error:', err);
                return res.status(400).json({
                    success: false,
                    error: err.message || 'Error uploading image'
                });
            }
            
            try {
                if (!req.file) {
                    return res.status(400).json({
                        success: false,
                        error: 'No image file provided'
                    });
                }
                
                // Access Cloudinary upload result directly
                
                
                if (!req.file.path && !req.file.secure_url) {
                    return res.status(500).json({
                        success: false,
                        error: 'Failed to get a valid URL from Cloudinary'
                    });
                }
                
                // Use secure_url from Cloudinary
                const imageUrl = req.file.secure_url || req.file.path;
                
                // Return success response with Cloudinary URL
                return res.status(200).json({
                    success: true,
                    data: {
                        imageUrl: imageUrl,
                        url: imageUrl,
                        secure_url: imageUrl,
                        originalFilename: req.file.originalname,
                        size: req.file.size,
                        public_id: req.file.public_id
                    }
                });
                
            } catch (error) {
                console.error('Error in image processing:', error);
                return res.status(500).json({
                    success: false,
                    error: 'Error processing image'
                });
            }
        });
    } catch (outerError) {
        console.error('Outer error in upload handler:', outerError);
        return res.status(500).json({
            success: false,
            error: 'Server error during upload process'
        });
    }
};

// @desc    Update a doctor's availability (time slots)
// @route   PUT /api/hospital/department/:deptIndex/doctor/:docIndex/slots
// @access  Private (Hospital Admin)
const updateDoctorSlots = async (req, res) => {
    console.log('Slot update: req.user =', req.user);
    try {
        const hospitalId = req.user.hospitalId;
        const { deptIndex, docIndex } = req.params;
        const { day, slots } = req.body;
        const hospital = await Hospital.findById(hospitalId);
        if (!hospital) {
            return res.status(404).json({ success: false, error: 'Hospital not found' });
        }
        const department = hospital.services[deptIndex];
        if (!department) {
            return res.status(404).json({ success: false, error: 'Department not found' });
        }
        const doctor = department.doctors[docIndex];
        if (!doctor) {
            return res.status(404).json({ success: false, error: 'Doctor not found' });
        }
        // Update or add the day's slots
        const dayIndex = doctor.availability.findIndex(a => a.day === day);
        if (dayIndex > -1) {
            doctor.availability[dayIndex].slots = slots;
        } else {
            doctor.availability.push({ day, slots });
        }
        await hospital.save();
        res.json({ success: true, data: doctor });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get available slots for a doctor on a given date
// @route   GET /api/hospital/department/:deptIndex/doctor/:docIndex/available-slots?date=YYYY-MM-DD
// @access  Private (Hospital Admin)
const getDoctorAvailableSlots = async (req, res) => {
    try {
        const hospitalId = req.user.hospitalId;
        const { deptIndex, docIndex } = req.params;
        const { date } = req.query;
        const hospital = await Hospital.findById(hospitalId);
        if (!hospital) {
            return res.status(404).json({ success: false, error: 'Hospital not found' });
        }
        const department = hospital.services[deptIndex];
        if (!department) {
            return res.status(404).json({ success: false, error: 'Department not found' });
        }
        const doctor = department.doctors[docIndex];
        if (!doctor) {
            return res.status(404).json({ success: false, error: 'Doctor not found' });
        }
        // Get day of week from date
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeek = days[new Date(date).getDay()];
        const dayAvailability = doctor.availability.find(a => a.day === dayOfWeek);
        console.log('--- getDoctorAvailableSlots DEBUG ---');
        console.log('doctor:', doctor.name);
        console.log('department:', department.category);
        console.log('date:', date);
        console.log('dayOfWeek:', dayOfWeek);
        console.log('dayAvailability:', dayAvailability);
        if (!dayAvailability) return res.json({ success: true, slots: [] });
        // Get already booked slots for this doctor and date
        const appointments = await Appointment.find({
            hospitalId,
            department: department.category,
            doctorId: doctor._id,
            appointmentDate: new Date(date)
        });
        console.log('appointments:', appointments);
        const bookedSlots = appointments.map(a => a.appointmentTime);
        console.log('bookedSlots:', bookedSlots);
        // Filter out booked slots
        const availableSlots = dayAvailability.slots.filter(slot => !bookedSlots.includes(slot));
        console.log('availableSlots:', availableSlots);
        res.json({ success: true, slots: availableSlots, bookedSlots });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = {
    getAppointments,
    getAppointment,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    getAppointmentStats,
    searchPatients,
    getHospitalProfile,
    updateHospitalProfile,
    uploadHospitalImage,
    updateDoctorSlots,
    getDoctorAvailableSlots
};
