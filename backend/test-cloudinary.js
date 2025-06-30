require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const path = require('path');

// Log environment variables (redacted for security)
console.log('Env Check:', {
  CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Not Set',
  API_KEY: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not Set',
  API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not Set'
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Test the Cloudinary configuration
async function testCloudinaryConfig() {
  try {
    // Make a simple API call to verify credentials
    const result = await cloudinary.api.ping();
    console.log('Cloudinary connection successful:', result);
    return true;
  } catch (error) {
    console.error('Cloudinary connection failed:', error);
    return false;
  }
}

// Test uploading a sample image
async function testImageUpload() {
  try {
    // Try to upload the test image
    const testImagePath = path.join(__dirname, 'test-image.jpg');
    console.log('Attempting to upload test image from:', testImagePath);
    
    // This will fail if the file doesn't exist, but it will show configuration errors
    const result = await cloudinary.uploader.upload(testImagePath, {
      folder: 'medtrax_test'
    });
    
    console.log('Upload successful:', {
      url: result.secure_url,
      public_id: result.public_id
    });
    
    return true;
  } catch (error) {
    console.error('Upload test failed:', error.message);
    if (error.http_code) {
      console.error('HTTP Status:', error.http_code);
    }
    return false;
  }
}

// Run tests
async function runTests() {
  console.log('Testing Cloudinary Configuration...');
  const configResult = await testCloudinaryConfig();
  
  if (configResult) {
    console.log('Testing Image Upload...');
    await testImageUpload();
  }
  
  console.log('Tests completed');
}

runTests();
