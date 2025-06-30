const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Review = require('../models/Review');
const Hospital = require('../models/Hospital');

// Route to submit a new review
router.post('/submit', protect, async (req, res) => {
    try {
        const { hospitalId, rating, text } = req.body;
        
        // Make sure user data exists and has required fields
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'User authentication required'
            });
        }
        
        const userId = req.user.id;
        
        // Get the user's name by combining firstName and lastName, or fallback to email
        let userName = 'Anonymous User';
        if (req.user.firstName && req.user.lastName) {
            userName = `${req.user.firstName} ${req.user.lastName}`.trim();
        } else if (req.user.firstName) {
            userName = req.user.firstName;
        } else if (req.user.lastName) {
            userName = req.user.lastName;
        } else if (req.user.email) {
            // Extract username from email if no name is available
            userName = req.user.email.split('@')[0];
        }
        
        // Set a more user-friendly location if not specified
        // We could fetch this from the user's city in a real app
        const userLocation = req.user.city || 'India';

        if (!hospitalId || !rating || !text) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Check if the hospital exists
        const hospital = await Hospital.findById(hospitalId);
        if (!hospital) {
            return res.status(404).json({
                success: false,
                message: 'Hospital not found'
            });
        }

        // Create the review
        const review = new Review({
            hospitalId,
            userId,
            rating,
            text,
            userName,
            userLocation,
            createdAt: new Date()
        });

        await review.save();

        // Update the hospital's rating and reviewsCount
        const allReviews = await Review.find({ hospitalId });
        const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / allReviews.length;
        
        hospital.rating = parseFloat(averageRating.toFixed(1));
        hospital.reviewsCount = allReviews.length;
        await hospital.save();

        return res.status(201).json({
            success: true,
            message: 'Review submitted successfully',
            data: { review }
        });
    } catch (error) {
        console.error('Error submitting review:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to submit review',
            error: error.message
        });
    }
});

// Route to get all reviews for a hospital
router.get('/hospital/:hospitalId', async (req, res) => {
    try {
        const { hospitalId } = req.params;
        
        // Check if the hospital exists
        const hospital = await Hospital.findById(hospitalId);
        if (!hospital) {
            return res.status(404).json({
                success: false,
                message: 'Hospital not found'
            });
        }

        // Get all reviews for the hospital, sorted by most recent first
        const reviews = await Review.find({ hospitalId }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: 'Reviews retrieved successfully',
            data: { reviews }
        });
    } catch (error) {
        console.error('Error getting reviews:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get reviews',
            error: error.message
        });
    }
});

module.exports = router;
