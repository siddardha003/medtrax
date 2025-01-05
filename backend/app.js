import express from 'express';
import dotenv from 'dotenv';  // Import dotenv to load .env file
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';


// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDB(); 

const app = express();

app.use(express.json());

// Route middlewares

app.use('/api/auth', authRoutes);


// Port to listen on
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});