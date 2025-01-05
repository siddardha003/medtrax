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
      doctorName: 'Bhimavaram',
      specialty: 'OPEN',
      image: 'data:image/jpeg;base64,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', // Example image URL
    },
    {
      clinicName: "Newmi Care's Dr Vandana Sherawat",
      doctorName: 'Bhimavaram',
      specialty: 'OPEN',
      image: 'https://media.istockphoto.com/id/1344779917/vector/medical-center-hospital-building-vector-design.jpg?s=612x612&w=0&k=20&c=_sZByueZhEZbK2WjQz1jqXy1_Rr5jYkgiVBj-2ls44s=', // Example image URL
    },
  ],
  Ghaziabad: [
    {
      clinicName: 'Blossom Women and Child Clinic',
      doctorName: 'Dr. Daksh Yadav',
      specialty: 'Pediatrician',
      image: 'https://example.com/clinic3.jpg', // Example image URL
    },
  ],
  Delhi: [
    {
      clinicName: 'Newmi Clinic Delhi',
      doctorName: 'Dr. Neha Sharma',
      specialty: 'Dermatologist',
      image: 'https://example.com/clinic4.jpg', // Example image URL
    },
  ],
  Noida: [],
  Faridabad: [
    {
      clinicName: 'Healthy Women Clinic',
      doctorName: 'Dr. Riya Verma',
      specialty: 'Gynaecologist',
      image: 'https://example.com/clinic5.jpg', // Example image URL
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
      <h3 style={{ textAlign: 'center', marginTop: '40px', color: '#005f73' }}>MEDTRAX HOSPITALS</h3>
      <ClinicsContainer>
        {clinics.length > 0 ? (
          clinics.map((clinic, index) => (
            <ClinicCard
              key={index}
              clinicName={clinic.clinicName}
              doctorName={clinic.doctorName}
              specialty={clinic.specialty}
              image={clinic.image}  // Pass the image URL
              buttonLink={`/hosui`}  // Navigate to a dynamic route (update as necessary)
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
