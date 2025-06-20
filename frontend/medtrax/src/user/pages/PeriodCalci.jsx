import React, { useState } from 'react';
import '../css/PeriodCalci.css';

const PeriodCalculator = () => {
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState(5); // Default period duration
  const [cycleLength, setCycleLength] = useState(28); // Default cycle length
  const [results, setResults] = useState(null);

  const calculateDates = () => {
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

    setResults({
      ovulationDate: ovulationDate.toDateString(),
      periodStart: nextPeriodStart.toDateString(),
      periodEnd: nextPeriodEnd.toDateString(),
    });
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
