const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');

// Configure Cloudinary
// Replace these with your actual Cloudinary credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set up storage engine for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'medtrax_uploads', // The folder in Cloudinary where images will be stored
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'], // Allowed image formats
    transformation: [
      { width: 1200, crop: 'limit' }, // Resize images to a reasonable size
      { quality: 'auto' } // Optimize image quality
    ],
    // This ensures URLs have https and the proper format
    format: async (req, file) => 'jpg', // Convert all images to JPG for consistency
    public_id: (req, file) => `${Date.now()}-${file.originalname.split('.')[0]}` // Unique filename
  }
});

// Create a multer upload instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    
    cb(new Error('Only image files (jpeg, jpg, png, gif) are allowed!'));
  }
});

module.exports = {
  cloudinary,
  upload
};
