import React, { useState } from "react";
import "../css/SymptomChecker.css";

const SymptomChecker = () => {
    const [symptoms, setSymptoms] = useState("");
    const [days, setDays] = useState(1);
    const [age, setAge] = useState("");
    const [severity, setSeverity] = useState(null);
    const [diagnosis, setDiagnosis] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const severityLevels = ["Low", "Moderate", "High"];

    const predictDisease = () => {
        setIsLoading(true);
        setTimeout(() => {
            const symptomLower = symptoms.toLowerCase();
            let recommendedMedication = "";

            if (symptomLower.includes("fever") && symptomLower.includes("cough")) {
                recommendedMedication = "- Paracetamol 500mg tablet\n- Dextromethorphan 30mg (cough suppressant)\n- Cetirizine 10mg for congestion";
            }
            else if (symptomLower.includes("headache") && symptomLower.includes("nausea")) {
                recommendedMedication = "- Ibuprofen 400mg tablet\n- Sumatriptan 50mg for migraine\n- Ondansetron 4mg for nausea";
            }
            else if (symptomLower.includes("stomach pain") && symptomLower.includes("diarrhea")) {
                recommendedMedication = "- Loperamide 2mg tablet\n- Omeprazole 20mg\n- Oral Rehydration Salts (ORS)";
            }
            else if (symptomLower.includes("allergy") || symptomLower.includes("sneezing")) {
                recommendedMedication = "- Cetirizine 10mg tablet\n- Montelukast 10mg\n- Loratadine 10mg";
            }
            else if (symptomLower.includes("joint pain") || symptomLower.includes("muscle pain")) {
                recommendedMedication = "- Diclofenac 50mg tablet\n- Acetaminophen 650mg\n- Naproxen 250mg";
            }
            else {
                recommendedMedication = "- Paracetamol 500mg tablet\n- Vitamin C 500mg\n- Multivitamin supplement";
            }

            setDiagnosis({
                recommendedMedication
            });
            setIsLoading(false);
        }, 1500);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!symptoms || !severity || !age) return alert("Please fill all fields!");
        predictDisease();
    };

    const resetForm = () => {
        setSymptoms("");
        setDays(1);
        setAge("");
        setSeverity(null);
        setDiagnosis(null);
        setShowForm(false);
    };

    return (
        <div className="prescription-prediction-container">
            <div className="prescriptionbanner">
                <h1>
                    Get Smart & AI-Powered Medication Recommendations, Instantly!
                    <br />
                </h1>
                <img
                    src="images/prescription-banner.png"
                    alt="Symptom checker illustration"
                    className="prescriptionbanner-image"
                />
            </div>

            {/* Form Section */}
            <div className="prescription-container20">
                <div className="prescription-section20">
                    <h2>Symptom Checker</h2>
                    {!showForm && !diagnosis && (
                        <div className="prescription-button-group20">
                            <button
                                className="prescriptionadd-btn20"
                                onClick={() => setShowForm(true)}
                            >
                                Generate Prescription
                            </button>
                        </div>
                    )}
                    {showForm && !diagnosis && (
                        <div className="prescription-button-group20">
                            <button
                                className="prescriptionadd-btn20"
                                onClick={() => setShowForm(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Input Form */}
            {showForm && !diagnosis && (
                <div className="prescription-container20">
                    <div className="prescriptioninp-section20">
                        <form onSubmit={handleSubmit}>
                            <div className="prescriptioninp-group20">
                                <div className="prescriptioninp-field20">
                                    <label htmlFor="symptoms">Symptoms: </label>
                                    <textarea
                                        id="symptoms"
                                        value={symptoms}
                                        onChange={(e) => setSymptoms(e.target.value)}
                                        placeholder="E.g., Fever, headache, cough..."
                                        required
                                    />
                                </div>

                                <div className="prescriptioninp-field20">
                                    <label htmlFor="age">Age (yrs): </label>
                                    <input
                                        type="number"
                                        id="age"
                                        min="0"
                                        max="120"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        required
                                        placeholder="Enter age"
                                    />
                                </div>

                                <div className="prescriptioninp-field20">
                                    <label htmlFor="days">Duration:<br/>(days) </label>
                                    <input
                                        type="number"
                                        id="days"
                                        min="1"
                                        max="30"
                                        value={days}
                                        onChange={(e) => setDays(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="prescriptioninp-field20">
                                    <label>Severity: </label>
                                    <div className="prescription-days-selection-container">
                                        {severityLevels.map((level) => (
                                            <button
                                                key={level}
                                                type="button"
                                                className={`day-circle-prescription ${severity === level ? "selected" : ""}`}
                                                onClick={() => setSeverity(level)}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="prescriptionsav-btn20"
                                disabled={isLoading}
                            >
                                {isLoading ? "Analyzing..." : "Check Symptoms"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Diagnosis Result */}
            {diagnosis && (
                <div className="prescription-display20">
                    <div className="prescription-section20">
                        <h3 style={{ textAlign: "center" }}>Recommended Medications</h3>
                        <div style={{ whiteSpace: 'pre-line', margin: '15px 0', fontFamily: 'serif', fontSize: '20px' }}>
                            {diagnosis.recommendedMedication}
                        </div>
                        <div style={{ marginTop: '20px' }}>
                            <small style={{ color: '#666' }}>
                                Note: Please consult a healthcare professional before taking any medication.
                            </small>
                        </div>
                        <button
                            className="prescription-delete-btn20 "
                            onClick={resetForm}
                        >
                            Check Again
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SymptomChecker;