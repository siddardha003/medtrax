const Appointment = require('../models/Appointment');
const Hospital = require('../models/Hospital');
const { getPaginationInfo } = require('../utils/helpers');
const { sendAppointmentConfirmation } = require('../utils/email');

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

        // Add search functionality
        if (search) {
            query.$or = [
                { 'patient.firstName': { $regex: search, $options: 'i' } },
                { 'patient.lastName': { $regex: search, $options: 'i' } },
                { 'patient.email': { $regex: search, $options: 'i' } },
                { 'patient.phone': { $regex: search, $options: 'i' } },
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
                pagination
            }
        });

    } catch (error) {
        console.error('Get appointments error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
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

// @desc    Create new appointment
// @route   POST /api/hospital/appointments
// @access  Private (Hospital Admin)
const createAppointment = async (req, res) => {
    try {
        const hospitalId = req.user.hospitalId;
        const appointmentData = {
            ...req.body,
            hospitalId,
            createdBy: req.user._id,
            bookedBy: 'hospital_staff'
        };

        // Check if hospital exists and is active
        const hospital = await Hospital.findById(hospitalId);
        if (!hospital || !hospital.isActive) {
            return res.status(400).json({
                success: false,
                error: 'Hospital not found or inactive'
            });
        }

        // Create appointment
        const appointment = await Appointment.create(appointmentData);

        // Populate hospital data for response
        await appointment.populate('hospitalId', 'name address phone email');

        // Send confirmation email
        try {
            await sendAppointmentConfirmation({
                patient: appointment.patient,
                hospital: appointment.hospitalId,
                appointmentDate: appointment.appointmentDate,
                appointmentTime: appointment.appointmentTime,
                confirmationCode: appointment.confirmationCode,
                department: appointment.department
            });
        } catch (emailError) {
            console.error('Failed to send appointment confirmation email:', emailError);
            // Continue without failing the appointment creation
        }

        res.status(201).json({
            success: true,
            message: 'Appointment created successfully',
            data: { appointment }
        });

    } catch (error) {
        console.error('Create appointment error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
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
        const { reason } = req.body;

        const appointment = await Appointment.findOne({
            _id: appointmentId,
            hospitalId
        });

        if (!appointment) {
            return res.status(404).json({
                success: false,
                error: 'Appointment not found'
            });
        }

        // Check if appointment can be cancelled
        if (!appointment.canBeCancelled()) {
            return res.status(400).json({
                success: false,
                error: 'Appointment cannot be cancelled (less than 24 hours notice or already completed)'
            });
        }

        // Update appointment status
        appointment.status = 'cancelled';
        appointment.cancellation = {
            cancelledAt: new Date(),
            cancelledBy: 'hospital',
            reason: reason || 'Cancelled by hospital',
            refundStatus: 'pending'
        };
        appointment.updatedBy = req.user._id;

        await appointment.save();

        res.status(200).json({
            success: true,
            message: 'Appointment cancelled successfully',
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

        // Aggregate statistics
        const stats = await Appointment.aggregate([
            {
                $match: {
                    hospitalId: hospitalId,
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAppointments: { $sum: 1 },
                    scheduledAppointments: {
                        $sum: { $cond: [{ $eq: ['$status', 'scheduled'] }, 1, 0] }
                    },
                    confirmedAppointments: {
                        $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] }
                    },
                    completedAppointments: {
                        $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                    },
                    cancelledAppointments: {
                        $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
                    },
                    noShowAppointments: {
                        $sum: { $cond: [{ $eq: ['$status', 'no_show'] }, 1, 0] }
                    }
                }
            }
        ]);

        // Get department-wise breakdown
        const departmentStats = await Appointment.aggregate([
            {
                $match: {
                    hospitalId: hospitalId,
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: '$department',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Get upcoming appointments (next 7 days)
        const upcoming = await Appointment.countDocuments({
            hospitalId,
            status: { $in: ['scheduled', 'confirmed'] },
            appointmentDate: {
                $gte: now,
                $lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
            }
        });

        res.status(200).json({
            success: true,
            message: 'Appointment statistics retrieved successfully',
            data: {
                summary: stats[0] || {
                    totalAppointments: 0,
                    scheduledAppointments: 0,
                    confirmedAppointments: 0,
                    completedAppointments: 0,
                    cancelledAppointments: 0,
                    noShowAppointments: 0
                },
                departmentBreakdown: departmentStats,
                upcomingAppointments: upcoming,
                period,
                dateRange: { startDate, endDate: now }
            }
        });

    } catch (error) {
        console.error('Get appointment stats error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
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

        // Search in appointments for patients
        const patients = await Appointment.aggregate([
            {
                $match: {
                    hospitalId: hospitalId,
                    $or: [
                        { 'patient.firstName': { $regex: q, $options: 'i' } },
                        { 'patient.lastName': { $regex: q, $options: 'i' } },
                        { 'patient.email': { $regex: q, $options: 'i' } },
                        { 'patient.phone': { $regex: q, $options: 'i' } }
                    ]
                }
            },
            {
                $group: {
                    _id: '$patient.email',
                    patient: { $first: '$patient' },
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

module.exports = {
    getAppointments,
    getAppointment,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    getAppointmentStats,
    searchPatients
};
