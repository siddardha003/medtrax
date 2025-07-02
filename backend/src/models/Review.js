const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: false
    },
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    text: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userLocation: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Validate that either hospitalId or shopId is provided (but not both)
reviewSchema.pre('save', function(next) {
    if ((!this.hospitalId && !this.shopId) || (this.hospitalId && this.shopId)) {
        next(new Error('Either hospitalId or shopId must be provided, but not both'));
    } else {
        next();
    }
});

// Index for faster retrieval of reviews by hospitalId or shopId
reviewSchema.index({ hospitalId: 1, createdAt: -1 });
reviewSchema.index({ shopId: 1, createdAt: -1 });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
