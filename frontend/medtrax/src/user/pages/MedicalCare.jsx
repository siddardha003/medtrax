import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/MedicalCare.css';

const MedicalCarePage = () => {
  const navigate = useNavigate();

  const handleTrackNow1 = () => {
    navigate('/HealthTracker');
  };
  const handleTrackNow2 = () => {
    navigate('/track');
  };
  const handleTrackNow3 = () => {
    navigate('/track');
  };
  const handleTrackNow4 = () => {
    navigate('/track');
  };
  const handleTrackNow5 = () => {
    navigate('/track');
  };
  const handleTrackNow6 = () => {
    navigate('/track');
  };
  const handleTrackNow7 = () => {
    navigate('/track');
  };
  const handleTrackNow8 = () => {
    navigate('/track');
  };
  const handleTrackNow9 = () => {
    navigate('/track');
  };

  return (
    <div className="medical-care-container">
      <div className="medcare-banner">
        <h1>Stay on top of your health with our comprehensive health trackers!</h1>
        <img src="https://preggerz.storehippo.com/s/6123687a0e3882eabaee1e6e/ms.files/newtoolnew.png" alt="Health tracker illustration" className="banner-image" />
      </div>
      <div className="tracker-card">
        <div className="card-content">
          <img src="images\health-tracker.png" alt="Health Tracker" className="tracker-image" />
          <div className="tracker-info">
            <h2>Health Tracker</h2>
            <p>
              A comprehensive health tracker that monitors weight, hormonal fluctuations,
              sleep patterns, headaches, and menstrual flow provides holistic insights into one's well-being.
            </p>
            <button className="track-butto" onClick={handleTrackNow1}>
              Track Now &rarr;
            </button>
          </div>
        </div>
      </div>
      <div className="tracker-card">
        <div className="card-content">
          <img src="images\period-tracking.png" alt="Health Tracker" className="tracker-image" />
          <div className="tracker-info">
            <h2>Period Calculator</h2>
            <p>
              Effortlessly track your menstrual cycle with our Period Calculator, 
              predicting ovulation windows and upcoming periods for better reproductive health management.
            </p>
            <button className="track-butto" onClick={handleTrackNow2}>
              Track Now &rarr;
            </button>
          </div>
        </div>
      </div>
      <div className="tracker-card">
        <div className="card-content">
          <img src="images\essential-test-tracker.png" alt="Health Tracker" className="tracker-image" />
          <div className="tracker-info">
            <h2>Essential Tests Tracker</h2>
            <p>
            Manage your health journey with our Essential Tests Tracker, 
            tailored to every life stage from adolescence to adulthood, ensuring timely screenings and proactive healthcare management.
            </p>
            <button className="track-butto" onClick={handleTrackNow3}>
              Track Now &rarr;
            </button>
          </div>
        </div>
      </div>
      <div className="tracker-card">
        <div className="card-content">
          <img src="images\baby-dev-tracker.png" alt="Health Tracker" className="tracker-image" />
          <div className="tracker-info">
            <h2>Baby Development Tracker</h2>
            <p>
            Track your little one's growth journey week by week with our Baby Development Tracker, 
            offering insights into height, weight, and size milestones coupled with pregnancy tips.
            </p>
            <button className="track-butto" onClick={handleTrackNow4}>
              Track Now &rarr;
            </button>
          </div>
        </div>
      </div>
      <div className="tracker-card">
        <div className="card-content">
          <img src="images\baby-vac-tracker.png" alt="Health Tracker" className="tracker-image" />
          <div className="tracker-info">
            <h2>Baby Vaccination Tracker</h2>
            <p>
            Ensure your baby's health is on track with our Baby Vaccination Tracker,
             guiding you through the crucial first year with schedules for vaccinations.
            </p>
            <button className="track-butto" onClick={handleTrackNow5}>
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
            <button className="track-butto" onClick={handleTrackNow6}>
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
            <button className="track-butto" onClick={handleTrackNow7}>
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
            <button className="track-butto" onClick={handleTrackNow8}>
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
            <button className="track-butto" onClick={handleTrackNow9}>
              Track Now &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalCarePage;