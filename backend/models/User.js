import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    gender: { type: String, required: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },  // for email OTP verification
});

const User = mongoose.model('User', userSchema);

export default User;