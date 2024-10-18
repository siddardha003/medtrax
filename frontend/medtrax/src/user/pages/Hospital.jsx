import styled from 'styled-components';
import LocationSelector from '../components/LocationSelector';
import ClinicCard from '../components/ClinicCard';
import React, { useState } from 'react';

// Adjusting the top margin
const AppContainer = styled.div`
  background: linear-gradient(135deg, #e0f7fa 0%, #80deea 100%);
  min-height: 100vh;
  padding: 20vh 20px 20px;
`;

const Header = styled.h2`
  text-align: center;
  font-size: 2.4rem;
  font-weight: bold;
  color: #005f73;
  margin: 20px 0;
  text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
`;

const ClinicsContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled.button`
  background-color: #005f73;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    background-color: #0a9396;
  }
`;

// Clinic data (without timings)
const clinicData = {
  Gurgaon: [
    {
      clinicName: 'Disha Clinic',
      doctorName: 'Dr. Astha Dayal',
      specialty: 'Gynaecologist',
      imageUrl: 'https://via.placeholder.com/150', // Replace with actual image URLs
      hospitalPage: '/hospital/disha-clinic', // Replace with actual hospital URLs
    },
    {
      clinicName: "Newmi Care's Dr Vandana Sherawat",
      doctorName: 'Dr. Vandana Sherawat',
      specialty: 'Gynaecologist',
      imageUrl: 'https://via.placeholder.com/150',
      hospitalPage: '/hospital/newmi-care',
    },
  ],
  Ghaziabad: [
    {
      clinicName: 'Blossom Women and Child Clinic',
      doctorName: 'Dr. Daksh Yadav',
      specialty: 'Pediatrician',
      imageUrl: 'https://via.placeholder.com/150',
      hospitalPage: '/hospital/blossom-clinic',
    },
  ],
  Delhi: [
    {
      clinicName: 'Newmi Clinic Delhi',
      doctorName: 'Dr. Neha Sharma',
      specialty: 'Dermatologist',
      imageUrl: 'https://via.placeholder.com/150',
      hospitalPage: '/hospital/newmi-delhi',
    },
  ],
  Noida: [],
  Faridabad: [
    {
      clinicName: 'Healthy Women Clinic',
      doctorName: 'Dr. Riya Verma',
      specialty: 'Gynaecologist',
      imageUrl: 'https://via.placeholder.com/150',
      hospitalPage: '/hospital/healthy-women',
    },
  ],
};

const HospitalCard = ({ clinicName, imageUrl, hospitalPage }) => (
  <div style={{ textAlign: 'center', width: '200px' }}>
    <img src={imageUrl} alt={clinicName} style={{ width: '100%', borderRadius: '10px' }} />
    <h3>{clinicName}</h3>
    <Button onClick={() => (window.location.href = hospitalPage)}>View Hospital</Button>
  </div>
);

const Hospital = () => {
  const [selectedLocation, setSelectedLocation] = useState('Gurgaon');

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
  };

  const clinics = clinicData[selectedLocation] || [];

  return (
    <AppContainer>
    <Header>Where Can You Find Us</Header>
    <LocationSelector selectedLocation={selectedLocation} onLocationChange={handleLocationChange} />
    <h3 style={{ textAlign: 'center', marginTop: '40px', color: '#005f73' }}>MEDTRAX MEDICAL SHOPS </h3>
    <ClinicsContainer>
        {clinics.length > 0 ? (
          clinics.map((clinic, index) => (
            <HospitalCard
              key={index}
              clinicName={clinic.clinicName}
              imageUrl={clinic.imageUrl}
              hospitalPage={clinic.hospitalPage}
            />
          ))
        ) : (
          <p style={{ textAlign: 'center', width: '100%' }}>No clinics available in this location.</p>
        )}
      </ClinicsContainer>
    </AppContainer>
  );
};

export default Hospital;
