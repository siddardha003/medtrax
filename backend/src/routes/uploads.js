const express = require('express');
const { upload, cloudinary } = require('../utils/cloudinary');
const { protect, authorize } = require('../middleware/auth');
const Hospital = require('../models/Hospital');

const router = express.Router();

// @route   POST /api/uploads/hospital-image
// @desc    Upload hospital image
// @access  Private (Hospital Admin only)
router.post('/hospital-image', protect, authorize('hospital_admin'), upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload an image file'
      });
    }

    const result = req.file;
    

    // Return the URL and other metadata
    res.status(200).json({
      success: true,
      data: {
        url: result.path || '', // This might be the cloudinary URL
        secure_url: result.secure_url || result.path || '', // Add secure_url for HTTPS
        imageUrl: result.secure_url || result.path || '', // For backward compatibility
        originalFilename: result.originalname,
        public_id: result.filename,
        mimetype: result.mimetype,
        size: result.size
      }
    });
  } catch (error) {
    console.error('Image upload error:', error);
    
    // If there's an error with Cloudinary, attempt to remove partial upload
    if (req.file && req.file.filename) {
      try {
        await cloudinary.uploader.destroy(req.file.filename);
      } catch (deleteErr) {
        console.error('Failed to delete partial upload:', deleteErr);
      }
    }
    
    res.status(500).json({
      success: false,
      error: error.message || 'Error uploading image'
    });
  }
});

// @route   POST /api/uploads/service-image
// @desc    Upload service/department image
// @access  Private (Hospital Admin only)
router.post('/service-image', protect, authorize('hospital_admin'), upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload an image file'
      });
    }

    const result = req.file;
    
    res.status(200).json({
      success: true,
      data: {
        url: result.path,
        originalFilename: result.originalname,
        public_id: result.filename,
        mimetype: result.mimetype,
        size: result.size
      }
    });
  } catch (error) {
    console.error('Service image upload error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error uploading image'
    });
  }
});

// @route   POST /api/uploads/doctor-image
// @desc    Upload doctor image
// @access  Private (Hospital Admin only)
router.post('/doctor-image', protect, authorize('hospital_admin'), upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload an image file'
      });
    }

    const result = req.file;
    
    res.status(200).json({
      success: true,
      data: {
        url: result.path,
        originalFilename: result.originalname,
        public_id: result.filename,
        mimetype: result.mimetype,
        size: result.size
      }
    });
  } catch (error) {
    console.error('Doctor image upload error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error uploading image'
    });
  }
});

// @route   DELETE /api/uploads/:public_id
// @desc    Delete an image from Cloudinary
// @access  Private (Hospital Admin only)
router.delete('/:public_id', protect, authorize('hospital_admin'), async (req, res, next) => {
  try {
    const result = await cloudinary.uploader.destroy(req.params.public_id);
    
    if (result.result === 'ok') {
      res.status(200).json({
        success: true,
        data: { message: 'Image deleted successfully' }
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Failed to delete image'
      });
    }
  } catch (error) {
    console.error('Image deletion error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error deleting image'
    });
  }
});

module.exports = router;
