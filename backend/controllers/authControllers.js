import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import OTP from '../models/OTP.js';
import nodemailer from 'nodemailer';

// Nodemailer setup for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Sign Up Controller
export const signUp = async (req, res) => {
    const { name, email, phone, gender, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ name, email, phone, gender, password: hashedPassword });

        // Save the user to the database
        await user.save();

        const otp = generateOTP();
        console.log(otp);  // For debugging: Log OTP to console

        const otpEntry = new OTP({ email, otp });
        await otpEntry.save();

        // Send OTP email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: 'Sign-up successful, OTP sent to email' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// OTP Verification Controller
export const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const otpEntry = await OTP.findOne({ email, otp });
        if (!otpEntry) return res.status(400).json({ message: 'Invalid OTP or expired' });

        // Mark the user as verified and retrieve the updated user
        const user = await User.findOneAndUpdate({ email }, { verified: true }, { new: true });

        // Delete the OTP entry from the database after verification
        await OTP.deleteOne({ email, otp });

        res.status(200).json({ message: 'OTP verified, account activated', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Sign In Controller
export const signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        if (!user.verified) return res.status(400).json({ message: 'Account not verified' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token, message: 'Sign in successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};