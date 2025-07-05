require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('🔍 Testing MongoDB connection...');
    console.log('📝 MONGODB_URI exists:', process.env.MONGODB_URI ? 'Yes' : 'No');
    
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI is not set in .env file');
      return;
    }
    
    // Check if it's SRV format
    if (process.env.MONGODB_URI.includes('mongodb+srv://')) {
      console.log('⚠️  Using SRV format - this might cause ENOTFOUND errors');
      console.log('💡 Consider switching to Standard format');
    } else {
      console.log('✅ Using Standard format');
    }
    
    console.log('🔗 Attempting to connect...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connection successful!');
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📊 Available collections:', collections.length);
    
    await mongoose.connection.close();
    console.log('🔒 Connection closed successfully');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('\n💡 Solution: Use Standard Connection String Format instead of SRV format');
      console.log('   - Go to MongoDB Atlas → Connect → Connect your application');
      console.log('   - Choose "Previous driver version" to get Standard format');
      console.log('   - Replace mongodb+srv:// with mongodb://');
    }
    
    if (error.message.includes('Authentication failed')) {
      console.log('\n💡 Solution: Check your username and password');
      console.log('   - Verify credentials in MongoDB Atlas');
      console.log('   - Make sure IP is whitelisted');
    }
  }
}

testConnection(); 