import styled from 'styled-components';
import LocationSelector from '../components/LocationSelector';
import ClinicCard from '../components/ClinicCard';
import React, { useState } from 'react';

// Adjusting the top margin
const AppContainer = styled.div`
 background: linear-gradient(135deg, #e0f7fa 0%, #80deea 100%);
   min-height: 100vh;
  padding: 20vh 20px 20px; /* 40vh margin at the top */
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

const clinicData = {
  Gurgaon: [
    {
      clinicName: 'Disha Clinic',
      doctorName: 'Dr. Astha Dayal',
      specialty: 'Gynaecologist',
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
      timings: [{ day: 'Mon to Sat', time: '11 am to 2 pm' }],
    },
    {
        clinicName: 'Disha Clinic',
        doctorName: 'Dr. Astha Dayal',
        specialty: 'Gynaecologist',
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
        timings: [{ day: 'Mon to Sat', time: '11 am to 2 pm' }],
      },
      {
        clinicName: 'Disha Clinic',
        doctorName: 'Dr. Astha Dayal',
        specialty: 'Gynaecologist',
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
        timings: [{ day: 'Mon to Sat', time: '11 am to 2 pm' }],
      },
      
  ],
  Ghaziabad: [
    {
      clinicName: 'Blossom Women and Child Clinic',
      doctorName: 'Dr. Daksh Yadav',
      specialty: 'Pediatrician',
      timings: [
        { day: 'Mon to Sat', time: '6 pm to 8:30 pm' },
        { day: 'Sun', time: '11 am to 1 pm, 6 pm to 7 pm' },
      ],
    },
  ],
  Delhi: [
    {
      clinicName: 'Newmi Clinic Delhi',
      doctorName: 'Dr. Neha Sharma',
      specialty: 'Dermatologist',
      timings: [
        { day: 'Mon to Fri', time: '10 am to 5 pm' },
        { day: 'Sat', time: '9 am to 1 pm' },
      ],
    },
  ],
  Noida: [],
  Faridabad: [
    {
      clinicName: 'Healthy Women Clinic',
      doctorName: 'Dr. Riya Verma',
      specialty: 'Gynaecologist',
      timings: [
        { day: 'Mon to Fri', time: '2 pm to 6 pm' },
        { day: 'Sat-Sun', time: '10 am to 1 pm' },
      ],
    },
  ],
};

const Medicines = () => {
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
            <ClinicCard
              key={index}
              clinicName={clinic.clinicName}
              doctorName={clinic.doctorName}
              specialty={clinic.specialty}
              timings={clinic.timings}
            />
          ))
        ) : (
          <p style={{ textAlign: 'center', width: '100%' }}>No clinics available in this location.</p>
        )}
      </ClinicsContainer>
    </AppContainer>
  );
};


export default Medicines;
