import React, { useState } from "react";
import "../css/SymptomChecker.css";

const SymptomChecker = () => {
    const [symptoms, setSymptoms] = useState("");
    const [days, setDays] = useState(1);
    const [severity, setSeverity] = useState(null);
    const [diagnosis, setDiagnosis] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const severityLevels = ["Low", "Moderate", "High"];

    const predictDisease = () => {
        setIsLoading(true);
        setTimeout(() => {
            const symptomLower = symptoms.toLowerCase();
            let predictedDisease = "";
            let prescription = "";
            let homeRemedy = "";

            if (symptomLower.includes("fever") && symptomLower.includes("cough")) {
                predictedDisease = "Common Cold / Flu";
                prescription = "Rest, Hydration, Paracetamol (500mg) every 6 hours if fever > 38°C";
                homeRemedy = "Drink warm water with honey & lemon, steam inhalation";
            }
            else if (symptomLower.includes("headache") && symptomLower.includes("nausea")) {
                predictedDisease = "Migraine or Tension Headache";
                prescription = "Ibuprofen (200-400mg) as needed, avoid bright lights";
                homeRemedy = "Apply cold compress, drink peppermint tea";
            }
            else if (symptomLower.includes("stomach pain") && symptomLower.includes("diarrhea")) {
                predictedDisease = "Food Poisoning / Gastritis";
                prescription = "ORS solution, Loperamide (if severe), avoid spicy food";
                homeRemedy = "Banana, rice, apple sauce, toast (BRAT diet)";
            }
            else {
                predictedDisease = "General Viral Infection";
                prescription = "Rest, hydration, monitor symptoms";
                homeRemedy = "Turmeric milk, ginger tea";
            }

            setDiagnosis({
                disease: predictedDisease,
                prescription,
                homeRemedy,
            });
            setIsLoading(false);
        }, 1500);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!symptoms || !severity) return alert("Please fill all fields!");
        predictDisease();
    };

    const resetForm = () => {
        setSymptoms("");
        setDays(1);
        setSeverity(null);
        setDiagnosis(null);
    };

    return (
        <div className="medical-reminder-container">
            <div className="rembanner">
                <h1>
                    Track your symptoms and get instant health insights!
                    <br />
                </h1>
                <img
                    src="https://preggerz.storehippo.com/s/6123687a0e3882eabaee1e6e/ms.files/newtoolnew.png"
                    alt="Symptom checker illustration"
                    className="rembanner-image"
                />
            </div>

            {/* Form Section */}
            <div className="reminder-container20">
                <div className="reminder-section20">
                    <h2>Symptom Checker</h2>
                    <div className="rem-button-group20">
                        <button
                            className="remadd-btn20"
                            onClick={() => setDiagnosis(null)}
                        >
                            Check New Symptoms
                        </button>
                    </div>
                </div>
            </div>

            {/* Input Form */}
            {!diagnosis ? (
                <div className="reminderinp-section20">
                    <form onSubmit={handleSubmit}>
                        <div className="reminderinp-group20">
                            <div className="reminderinp-field20">
                                <label htmlFor="symptoms">Symptoms: </label>
                                <textarea
                                    id="symptoms"
                                    value={symptoms}
                                    onChange={(e) => setSymptoms(e.target.value)}
                                    placeholder="E.g., Fever, headache, cough..."
                                    required
                                    className="symptom-textarea"
                                />
                            </div>

                            <div className="reminderinp-field20">
                                <label htmlFor="days">Duration (Days): </label>
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

                            <div className="reminderinp-field20 severity-field">
                                <label>Severity: </label>
                                <div className="days-selection-container">
                                    {severityLevels.map((level) => (
                                        <button
                                            key={level}
                                            type="button"
                                            className={`day-circle ${severity === level ? "selected" : ""
                                                }`}
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
                            className="remsav-btn20"
                            disabled={isLoading}
                        >
                            {isLoading ? "Analyzing..." : "Check Symptoms"}
                        </button>
                    </form>
                </div>
            ) : (
                /* Diagnosis Result (Matched to Medical Reminder's Card Style) */
                <div className="reminder-display20">
                    <div className="reminder-section20">
                        <h3>Diagnosis Report</h3>
                        <p><strong>Condition:</strong> {diagnosis.disease}</p>
                        <p><strong>Prescription:</strong> {diagnosis.prescription}</p>
                        <p><strong>Home Remedy:</strong> {diagnosis.homeRemedy}</p>
                        <button
                            className="rem-delete-btn20"
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