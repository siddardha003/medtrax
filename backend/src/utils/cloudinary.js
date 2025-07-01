const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');

// Configure Cloudinary with explicit values from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dsqwowdxw',
  api_key: process.env.CLOUDINARY_API_KEY || '145142744562815',
  api_secret: process.env.CLOUDINARY_API_SECRET || '6ZBUbQd2bUqZy20nWQ-D89WE5A0'
});

// Verify cloudinary configuration is correct
console.log('Cloudinary Configuration:', {
  cloud_name: cloudinary.config().cloud_name,
  api_key: cloudinary.config().api_key ? 'Set correctly' : 'NOT SET',
  api_secret: cloudinary.config().api_secret ? 'Set correctly' : 'NOT SET'
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
    secure: true, // Force https URLs
    format: 'jpg', // Convert all images to JPG for consistency
    public_id: (req, file) => {
      const filename = `hospital_${Date.now()}-${file.originalname.split('.')[0]}`;
      console.log(`Generated public_id for Cloudinary: ${filename}`);
      return filename;
    }
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
