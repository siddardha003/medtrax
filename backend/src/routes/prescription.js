// backend/routes/prescription.js

const express = require('express');
const router = express.Router();
const axios = require('axios');

// POST /api/prescription
router.post('/predict', async (req, res) => {
  try {
    const { symptoms, age, duration, severity } = req.body;

    // Send request to Flask ML API
    const response = await axios.post('http://localhost:5001/predict', {
      symptoms,
      age,
      duration,
      severity,
    });

    const { prescriptions, precautions } = response.data;

    res.status(200).json({ prescriptions, precautions });
  } catch (error) {
    console.error('Error connecting to ML model:', error.message);
    res.status(500).json({ error: 'Failed to get prediction from ML model.' });
  }
});

module.exports = router;
