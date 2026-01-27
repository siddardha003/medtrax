# backend/src/ml_model/api.py
from flask_cors import CORS
from flask import Flask, request, jsonify
import joblib
import numpy as np
import re
import os

app = Flask(__name__)
CORS(app)
# Load model and encoders
model = joblib.load('prescription_model.pkl')
symptom_encoder = joblib.load('symptom_encoder.pkl')
prescription_encoder = joblib.load('prescription_encoder.pkl')
precaution_encoder = joblib.load('precaution_encoder.pkl')
severity_encoder = joblib.load('severity_encoder.pkl')
scaler = joblib.load('scaler.pkl')

def clean_symptoms(text):
    text = text.lower()
    text = re.sub(r'\d+', '', text)
    text = re.sub(r'[^\w,\s]', '', text)
    return [s.strip() for s in text.split(',') if s.strip()]

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    symptoms = data.get('symptoms', [])
    age = data.get('age', 30)
    duration = data.get('duration', 5)
    severity = data.get('severity', 'mild')

    # Clean and encode symptoms
    if isinstance(symptoms, str):
        symptoms = clean_symptoms(symptoms)
    else:
        symptoms = [s.lower().strip() for s in symptoms]
    symptoms_encoded = symptom_encoder.transform([symptoms])

    # Lowercase and validate severity
    severity = severity.lower()
    if severity not in ['mild', 'moderate', 'severe']:
        severity = 'moderate'
    severity_encoded = severity_encoder.transform([[severity]]).toarray()

    # Scale age and duration
    numeric_features = scaler.transform([[age, duration]])

    # Stack features in the same order as Colab
    final_input = np.hstack([symptoms_encoded, numeric_features, severity_encoded])

    # Model prediction
    prediction = model.predict(final_input)
    n_presc = len(prescription_encoder.classes_)
    presc_pred = prescription_encoder.inverse_transform(prediction[:, :n_presc])[0]
    prec_pred = precaution_encoder.inverse_transform(prediction[:, n_presc:])[0]

    return jsonify({
        'prescriptions': list(presc_pred),
        'precautions': list(prec_pred)
    })

@app.route('/symptoms', methods=['GET'])
def get_symptoms():
    # Clean and deduplicate symptoms
    raw_symptoms = list(symptom_encoder.classes_)
    clean_symptoms = sorted(set(s.strip() for s in raw_symptoms if s.strip()))
    return jsonify({'symptoms': clean_symptoms})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=False)
