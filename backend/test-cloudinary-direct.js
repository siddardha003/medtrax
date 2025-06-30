require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Log Cloudinary config (redacted for security)
console.log('Cloudinary Config:', {
  CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Not Set',
  API_KEY: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not Set',
  API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not Set'
});

// Test direct Cloudinary upload
async function testDirectUpload() {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    
    // Create a timestamp for the signature
    const timestamp = Math.floor(Date.now() / 1000);
    
    // Create a signature string
    const signature = require('crypto')
      .createHash('sha1')
      .update(`timestamp=${timestamp}${apiSecret}`)
      .digest('hex');
    
    // Create form data
    const formData = new FormData();
    formData.append('file', fs.createReadStream(path.join(__dirname, 'uploads', 'test.jpg')));
    formData.append('timestamp', timestamp);
    formData.append('api_key', apiKey);
    formData.append('signature', signature);
    
    // Upload to Cloudinary
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData,
      {
        headers: {
          ...formData.getHeaders()
        }
      }
    );
    
    console.log('Direct upload response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Direct upload error:', error.message);
    if (error.response) {
      console.error('Error details:', error.response.data);
    }
    return null;
  }
}

// Create a test image if it doesn't exist
function createTestImage() {
  const dir = path.join(__dirname, 'uploads');
  const filePath = path.join(dir, 'test.jpg');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Create a simple test image if it doesn't exist
  if (!fs.existsSync(filePath)) {
    console.log('Creating test image...');
    
    // Create a very basic image (1x1 pixel black JPEG)
    const imageData = Buffer.from([
      0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
      0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
      0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
      0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
      0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
      0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
      0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
      0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xC2, 0x00, 0x0B, 0x08, 0x00, 0x01, 0x00,
      0x01, 0x01, 0x01, 0x11, 0x00, 0xFF, 0xC4, 0x00, 0x14, 0x00, 0x01, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0xFF, 0xDA, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3F,
      0x00, 0xD2, 0xCF, 0x20, 0xFF, 0xD9
    ]);
    
    fs.writeFileSync(filePath, imageData);
    console.log('Test image created at:', filePath);
  } else {
    console.log('Test image already exists at:', filePath);
  }
  
  return filePath;
}

async function main() {
  createTestImage();
  await testDirectUpload();
}

main().catch(console.error);
