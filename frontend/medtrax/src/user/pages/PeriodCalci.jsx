import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import the default styling for the datepicker
import '../css/PeriodCalci.css';

const PeriodCalculator = () => {
  const [periodStart, setPeriodStart] = useState(null); // Change initial state to null
  const [duration, setDuration] = useState(5);
  const [cycleLength, setCycleLength] = useState(28);
  const [ovulationDate, setOvulationDate] = useState(null);
  const [nextPeriod, setNextPeriod] = useState(null);

  const incrementDuration = () => setDuration(duration + 1);
  const decrementDuration = () => setDuration(Math.max(duration - 1, 1));

  const incrementCycleLength = () => setCycleLength(cycleLength + 1);
  const decrementCycleLength = () => setCycleLength(Math.max(cycleLength - 1, 1));

  const calculateDates = () => {
    if (periodStart) {
      const startDate = new Date(periodStart);
      const ovulationDay = new Date(startDate);
      const nextPeriodStart = new Date(startDate);
      const nextPeriodEnd = new Date(startDate);

      // Estimate ovulation date (14 days before the next period)
      ovulationDay.setDate(ovulationDay.getDate() + cycleLength - 14);
      setOvulationDate(ovulationDay);

      // Estimate next period dates
      nextPeriodStart.setDate(nextPeriodStart.getDate() + cycleLength);
      nextPeriodEnd.setDate(nextPeriodStart.getDate() + duration - 1);
      setNextPeriod({ start: nextPeriodStart, end: nextPeriodEnd });
    }
  };

  const resetCalculator = () => {
    setPeriodStart(null);
    setDuration(5);
    setCycleLength(28);
    setOvulationDate(null);
    setNextPeriod(null);
  };

  return (
    <div className="medical-care-container">
      <div className="banner">
        <h1>Stay on top of your health with our comprehensive health trackers!</h1>
        <img
          src="https://preggerz.storehippo.com/s/6123687a0e3882eabaee1e6e/ms.files/newtoolnew.png"
          alt="Health tracker illustration"
          className="banner-image"
        />
      </div>

      <div className="period-calculator">
        <div className="form-group">
          <label>When did your last period start?</label>
          <DatePicker
            selected={periodStart}
            onChange={(date) => setPeriodStart(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select date"
            className="custom-datepicker"
          />
        </div>

        <div className="form-group">
          <label>How many days did it last?</label>
          <div className="input-group">
            <button onClick={decrementDuration}>-</button>
            <span>{duration}</span>
            <button onClick={incrementDuration}>+</button>
          </div>
        </div>

        <div className="form-group">
          <label>Average cycle length (days)</label>
          <div className="input-group">
            <button onClick={decrementCycleLength}>-</button>
            <span>{cycleLength}</span>
            <button onClick={incrementCycleLength}>+</button>
          </div>
        </div>

        <button className="submit-btn" onClick={calculateDates}>
          See results
        </button>

        {ovulationDate && nextPeriod && (
          <div className="results">
            <div className="result-card">
              <p>Your Estimated Ovulation Date</p>
              <div className="date-circle">
                {ovulationDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
              </div>
            </div>

            <div className="result-card">
              <p>Your Estimated Period Dates</p>
              <div className="date-circle">
                {nextPeriod.start.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })} -
                {nextPeriod.end.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
              </div>
            </div>

            <button className="reset-btn" onClick={resetCalculator}>
              Start Over
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PeriodCalculator;
