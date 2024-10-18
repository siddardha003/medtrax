import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/MedicalCare.css';

const MedicalCarePage = () => {
  const navigate = useNavigate();

  const handleTrackNow = () => {
    navigate('/track');
  };

  return (
    <div className="medical-care-container">
      <div className="banner">
        <h1>Stay on top of your health with our comprehensive health trackers!</h1>
        <img src="https://preggerz.storehippo.com/s/6123687a0e3882eabaee1e6e/ms.files/newtoolnew.png" alt="Health tracker illustration" className="banner-image" />
      </div>
      <div className="tracker-card">
        <div className="card-content">
          <img src="path-to-health-tracker-image.png" alt="Health Tracker" className="tracker-image" />
          <div className="tracker-info">
            <h2>Health Tracker</h2>
            <p>
              A comprehensive health tracker that monitors weight, hormonal fluctuations,
              sleep patterns, headaches, and menstrual flow provides holistic insights into one's well-being.
            </p>
            <button className="track-button" onClick={handleTrackNow}>
              Track Now &rarr;
            </button>
          </div>
        </div>
      </div>
      <div className="tracker-card">
        <div className="card-content">
          <img src="path-to-health-tracker-image.png" alt="Health Tracker" className="tracker-image" />
          <div className="tracker-info">
            <h2>Period Calculator</h2>
            <p>
              A comprehensive health tracker that monitors weight, hormonal fluctuations,
              sleep patterns, headaches, and menstrual flow provides holistic insights into one's well-being.
            </p>
            <button className="track-button" onClick={handleTrackNow}>
              Track Now &rarr;
            </button>
          </div>
        </div>
      </div>
      <div className="tracker-card">
        <div className="card-content">
          <img src="path-to-health-tracker-image.png" alt="Health Tracker" className="tracker-image" />
          <div className="tracker-info">
            <h2>Essential Tests Tracker</h2>
            <p>
              A comprehensive health tracker that monitors weight, hormonal fluctuations,
              sleep patterns, headaches, and menstrual flow provides holistic insights into one's well-being.
            </p>
            <button className="track-button" onClick={handleTrackNow}>
              Track Now &rarr;
            </button>
          </div>
        </div>
      </div>
      <div className="tracker-card">
        <div className="card-content">
          <img src="path-to-health-tracker-image.png" alt="Health Tracker" className="tracker-image" />
          <div className="tracker-info">
            <h2>Baby Development Tracker</h2>
            <p>
              A comprehensive health tracker that monitors weight, hormonal fluctuations,
              sleep patterns, headaches, and menstrual flow provides holistic insights into one's well-being.
            </p>
            <button className="track-button" onClick={handleTrackNow}>
              Track Now &rarr;
            </button>
          </div>
        </div>
      </div>
      <div className="tracker-card">
        <div className="card-content">
          <img src="path-to-health-tracker-image.png" alt="Health Tracker" className="tracker-image" />
          <div className="tracker-info">
            <h2>Baby Vaccination Tracker</h2>
            <p>
              A comprehensive health tracker that monitors weight, hormonal fluctuations,
              sleep patterns, headaches, and menstrual flow provides holistic insights into one's well-being.
            </p>
            <button className="track-button" onClick={handleTrackNow}>
              Track Now &rarr;
            </button>
          </div>
        </div>
      </div>
      <div className="tracker-card">
        <div className="card-content">
          <img src="path-to-health-tracker-image.png" alt="Health Tracker" className="tracker-image" />
          <div className="tracker-info">
            <h2>Prescription Prediction</h2>
            <p>
              A comprehensive health tracker that monitors weight, hormonal fluctuations,
              sleep patterns, headaches, and menstrual flow provides holistic insights into one's well-being.
            </p>
            <button className="track-button" onClick={handleTrackNow}>
              Track Now &rarr;
            </button>
          </div>
        </div>
      </div>
      <div className="tracker-card">
        <div className="card-content">
          <img src="path-to-health-tracker-image.png" alt="Health Tracker" className="tracker-image" />
          <div className="tracker-info">
            <h2>Symptom Checker</h2>
            <p>
              A comprehensive health tracker that monitors weight, hormonal fluctuations,
              sleep patterns, headaches, and menstrual flow provides holistic insights into one's well-being.
            </p>
            <button className="track-button" onClick={handleTrackNow}>
              Track Now &rarr;
            </button>
          </div>
        </div>
      </div>
      <div className="tracker-card">
        <div className="card-content">
          <img src="path-to-health-tracker-image.png" alt="Health Tracker" className="tracker-image" />
          <div className="tracker-info">
            <h2>Skin Disease Detection</h2>
            <p>
              A comprehensive health tracker that monitors weight, hormonal fluctuations,
              sleep patterns, headaches, and menstrual flow provides holistic insights into one's well-being.
            </p>
            <button className="track-button" onClick={handleTrackNow}>
              Track Now &rarr;
            </button>
          </div>
        </div>
      </div>
      <div className="tracker-card">
        <div className="card-content">
          <img src="path-to-health-tracker-image.png" alt="Health Tracker" className="tracker-image" />
          <div className="tracker-info">
            <h2>Medical Remainder</h2>
            <p>
              A comprehensive health tracker that monitors weight, hormonal fluctuations,
              sleep patterns, headaches, and menstrual flow provides holistic insights into one's well-being.
            </p>
            <button className="track-button" onClick={handleTrackNow}>
              Track Now &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalCarePage;