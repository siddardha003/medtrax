import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    medicalHistory: [String],
    currentCondition: String,
    doctorAssigned: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    bed: { type: mongoose.Schema.Types.ObjectId, ref: 'Bed' },
});

const Patient = mongoose.model('Patient', patientSchema);
export default Patient;