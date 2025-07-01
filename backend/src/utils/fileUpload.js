const path = require('path');
const fs = require('fs');
const { cloudinary } = require('./cloudinary');

// Ensure uploads directory exists (for temporary storage if needed)
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Function to upload directly to Cloudinary
const uploadToCloudinary = async (file) => {
  try {
    console.log('Uploading to Cloudinary directly...');
    
    // If file is a path, upload the file at that path
    if (typeof file === 'string') {
      const result = await cloudinary.uploader.upload(file, {
        folder: 'medtrax_uploads',
        use_filename: true,
        resource_type: 'auto'
      });
      
      // Delete the local file after successful Cloudinary upload
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
      
      return {
        success: true,
        url: result.secure_url,
        public_id: result.public_id
      };
    } 
    // If file is a buffer or stream, upload that
    else {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'medtrax_uploads',
            resource_type: 'auto'
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        
        // If it's a buffer, pipe it to the upload stream
        if (file.buffer) {
          uploadStream.end(file.buffer);
        } else {
          // Otherwise assume it's a readable stream and pipe it
          file.pipe(uploadStream);
        }
      });
      
      return {
        success: true,
        url: result.secure_url,
        public_id: result.public_id
      };
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload to Cloudinary'
    };
  }
};

module.exports = {
  uploadToCloudinary,
  cloudinary
};
