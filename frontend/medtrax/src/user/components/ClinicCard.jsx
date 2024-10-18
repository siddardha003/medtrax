import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background-color: #e8efef;
  width: 300px; /* Fixed width */
  height: 400px; /* Fixed height */
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
`;

const ClinicName = styled.h4`
  font-size: 18px;
  margin-bottom: 10px;
`;

const DoctorName = styled.p`
  font-size: 16px;
  margin-bottom: 5px;
`;

const Specialty = styled.p`
  font-size: 14px;
  color: #555;
  margin-bottom: 10px;
`;

const Timings = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Timing = styled.div`
  background-color: #fff;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
`;

const ClinicCard = ({ clinicName, doctorName, specialty, timings }) => {
  return (
    <Card>
      <div>
        <ClinicName>{clinicName}</ClinicName>
        <DoctorName>{doctorName}</DoctorName>
        <Specialty>{specialty}</Specialty>
      </div>
      <Timings>
        {timings.map((timing, index) => (
          <Timing key={index}>
            {timing.day}: {timing.time}
          </Timing>
        ))}
      </Timings>
    </Card>
  );
};

export default ClinicCard;
