import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { savePeriodDataApi, getPeriodDataApi } from '../../Api';
import '../css/PeriodCalci.css';

const PeriodCalculator = () => {
  const { isAuthenticated, user } = useAuth();
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState(5); // Default period duration
  const [cycleLength, setCycleLength] = useState(28); // Default cycle length
  const [results, setResults] = useState(null);

  // Load saved period data for authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      loadPeriodData();
    }
  }, [isAuthenticated]);

  const loadPeriodData = async () => {
    try {
      const response = await getPeriodDataApi();
      if (response.data.success && response.data.data) {
        const data = response.data.data;
        setStartDate(new Date(data.lastPeriodStart).toISOString().split('T')[0]);
        setDuration(data.periodDuration);
        setCycleLength(data.cycleLength);
        
        // Show calculated results
        setResults({
          ovulationDate: new Date(data.estimatedOvulation).toDateString(),
          periodStart: new Date(data.nextPeriodStart).toDateString(),
          periodEnd: new Date(data.nextPeriodEnd).toDateString(),
        });
      }
    } catch (error) {
      console.error('Error loading period data:', error);
    }
  };

  const calculateDates = async () => {
    if (!startDate) {
      alert('Please select a start date.');
      return;
    }

    const start = new Date(startDate);
    const ovulationDate = new Date(start);
    ovulationDate.setDate(start.getDate() + Math.floor(cycleLength / 2));

    const nextPeriodStart = new Date(start);
    nextPeriodStart.setDate(start.getDate() + cycleLength);

    const nextPeriodEnd = new Date(nextPeriodStart);
    nextPeriodEnd.setDate(nextPeriodStart.getDate() + duration - 1);

    const calculatedResults = {
      ovulationDate: ovulationDate.toDateString(),
      periodStart: nextPeriodStart.toDateString(),
      periodEnd: nextPeriodEnd.toDateString(),
    };

    setResults(calculatedResults);

    // Save to backend if user is authenticated
    if (isAuthenticated) {
      try {
        const response = await savePeriodDataApi({
          lastPeriodStart: startDate,
          periodDuration: duration,
          cycleLength: cycleLength
        });
        
        if (response.data.success) {
          alert('Period data saved successfully!');
        }
      } catch (error) {
        console.error('Error saving period data:', error);
        alert('Error saving period data. Data calculated locally.');
      }
    } else {
      alert('Please login to save your period data permanently.');
    }
  };

  const resetForm = () => {
    setStartDate('');
    setDuration(5);
    setCycleLength(28);
    setResults(null);
  };
  return (
    <div className="period-calci-container">
      <div className="percalcibanner">
        <h1>
          Stay on top of your health with our comprehensive health trackers!
          <br />
        </h1>
        <img
          src="https://cdn.megawecare.com/GHBY/Calculator-Images/period-cycle-calculator-2D-v2.webp"
          alt="Health tracker illustration"
          className="percalcibanner-image"
        />
      </div>

      {/* User Status Indicator */}
      <div className="user-status-indicator" style={{
        textAlign: 'center',
        padding: '10px',
        margin: '20px',
        backgroundColor: isAuthenticated ? '#e8f5e8' : '#fff3cd',
        border: `1px solid ${isAuthenticated ? '#d4edda' : '#ffeaa7'}`,
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        {isAuthenticated ? (
          <span style={{ color: '#155724' }}>
            ✓ Logged in as {user?.name || 'User'} - Your period data will be saved permanently
          </span>
        ) : (
          <span style={{ color: '#856404' }}>
            ⚠️ You're browsing as a guest - Please log in to save your period data permanently
          </span>
        )}
      </div>

      <div className="pertracker-container20">

        <div className="periodinp-section20">
          <h2 style={{ color: '#02a2ae', textAlign: 'center', marginBottom: '30px' }}>
            Period Calculator
          </h2>
          <div className="periodinp-group20">
            <div className="periodinp-field20">
              <label style={{ fontWeight: 'bold', color: '#026a6e' }}>
                When did your last period start?
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="periodinp-field20">
              <label style={{ fontWeight: 'bold', color: '#026a6e' }}>
                How many days did it last?
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value, 10) || 1))}
              />
            </div>
            <div className="periodinp-field20">
              <label style={{ fontWeight: 'bold', color: '#026a6e' }}>
                Average cycle length (days)
              </label>
              <input
                type="number"
                value={cycleLength}
                onChange={(e) => setCycleLength(Math.max(1, parseInt(e.target.value, 10) || 1))}
              />
            </div>
          </div>
          <div className="bu-group20">
            <button onClick={calculateDates}>See Results</button>
            <button onClick={resetForm}>Start Over</button>
          </div>
        </div>
        {results && (
          <div className="period20">
            <div className="period-display20">
              <h6>Your Estimated Ovulation Date </h6><br></br>
              <span className="period-circle20">{results.ovulationDate}</span>
            </div>
            <div className="period-display20">
              <h6>Your Estimated Period Dates</h6>
              <div className="period-dates-container20">
                <span className="period-circle20">{results.periodStart}</span>
                <span>-</span>
                <span className="period-circle20">{results.periodEnd}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PeriodCalculator;
