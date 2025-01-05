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
  text-align: center;
`;

const Image = styled.img`
  width: 100%;
  height: 150px; /* Fixed height for the image */
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 15px;
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

const Button = styled.a`
  padding: 10px 20px;
  background-color: #00796b;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #004d40;
  }
`;

const ClinicCard = ({ clinicName, doctorName, specialty, image, buttonLink }) => {
  return (
    <Card>
      <Image src={image} alt={clinicName} />
      <div>
        <ClinicName>{clinicName}</ClinicName>
        <DoctorName>{doctorName}</DoctorName>
        <Specialty>{specialty}</Specialty>
      </div>
      <Button href={buttonLink}>View Details</Button>
    </Card>
  );
};

export default ClinicCard;
