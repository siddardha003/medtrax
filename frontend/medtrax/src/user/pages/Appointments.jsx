import React, { useState } from 'react';
import styled from 'styled-components';
import LocationSelector from '../components/LocationSelector';
import ClinicCard from '../components/ClinicCard';
import ModeSelector from '../components/ModeSelector'; 

// Gradient background with softer transitions
const AppContainer = styled.div`
  background: linear-gradient(135deg, #e0f7fa 0%, #80deea 100%);
  min-height: 100vh;
  padding: 20vh 20px 20px;
  font-family: 'Arial', sans-serif;
`;

// Enhanced header with a better font and color scheme
const Header = styled.h2`
  text-align: center;
  font-size: 2.4rem;
  font-weight: bold;
  color: #005f73;
  margin: 20px 0;
  text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
`;

// Flex container for displaying clinics with a gap and responsive design
const ClinicsContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 30px;
`;

// Styled clinic card for a more modern look
const StyledClinicCard = styled(ClinicCard)`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
`;

// Message when no clinics are found with an improved design
const NoClinicsMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #333;
  margin-top: 20px;
  opacity: 0.85;

  img {
    width: 150px;
    margin-bottom: 15px;
  }

  p {
    font-size: 1rem;
    color: #777;
  }
`;

// Sample clinic data
const clinicData = {
  Gurgaon: [
    {
      clinicName: 'Disha Clinic',
      doctorName: 'Dr. Astha Dayal',
      specialty: 'Gynaecologist',
      mode: 'Offline',
      timings: [
        { day: 'Mon', time: '9 am to 1 pm' },
        { day: 'Tue-Fri', time: '2 pm to 8 pm' },
        { day: 'Sat', time: '9 am to 11 am, 6 pm to 8 pm' },
        { day: 'Sun', time: '9 am to 1 pm' },
      ],
    },
    {
      clinicName: "Newmi Care's Dr Vandana Sherawat",
      doctorName: 'Dr. Vandana Sherawat',
      specialty: 'Gynaecologist',
      mode: 'Online',
      timings: [{ day: 'Mon to Sat', time: '11 am to 2 pm' }],
    },
  ],
  Ghaziabad: [
    {
      clinicName: 'Blossom Women and Child Clinic',
      doctorName: 'Dr. Daksh Yadav',
      specialty: 'Pediatrician',
      mode: 'Offline',
      timings: [
        { day: 'Mon to Sat', time: '6 pm to 8:30 pm' },
        { day: 'Sun', time: '11 am to 1 pm, 6 pm to 7 pm' },
      ],
    },
  ],
  // Other location data...
};

const Appointments = () => {
  const [selectedLocation, setSelectedLocation] = useState('Gurgaon');
  const [selectedMode, setSelectedMode] = useState('Offline');

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
  };

  const handleModeChange = (mode) => {
    setSelectedMode(mode);
  };

  // Filter clinics based on selected location and mode
  const clinics = (clinicData[selectedLocation] || []).filter(
    clinic => clinic.mode === selectedMode
  );

  return (
    <AppContainer>
      <Header>Choose Mode of Appointment</Header>
      <ModeSelector selectedMode={selectedMode} onModeChange={handleModeChange} />
      
      <Header>Select Your Location</Header>
      <LocationSelector selectedLocation={selectedLocation} onLocationChange={handleLocationChange} />

      <h3 style={{ textAlign: 'center', marginTop: '20px', color: '#005f73' }}>MEDTRAX HOSPITALS</h3>
      <ClinicsContainer>
        {clinics.length > 0 ? (
          clinics.map((clinic, index) => (
            <StyledClinicCard
              key={index}
              clinicName={clinic.clinicName}
              doctorName={clinic.doctorName}
              specialty={clinic.specialty}
              timings={clinic.timings}
            />
          ))
        ) : (
          <NoClinicsMessage>
            <img src="/images/no-clinics.png" alt="No Clinics Available" />
            <p>No clinics available in this location for the selected mode.</p>
          </NoClinicsMessage>
        )}
      </ClinicsContainer>
    </AppContainer>
  );
};

export default Appointments;
