const mongoose = require('mongoose');

const connectDB = async () => {
    try {        const conn = await mongoose.connect(process.env.MONGODB_URI);

        
        
        // Connection event listeners
        mongoose.connection.on('connected', () => {
            
        });

        mongoose.connection.on('error', (err) => {
            console.error('❌ Mongoose connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
