import React, { useState } from 'react';
import styled from 'styled-components';
import { MapPin, Star, Phone, ArrowRight, Search } from 'lucide-react';

// Using the exact same background as previous
const AppContainer = styled.div`
  background: linear-gradient(135deg, #9cf7cd 0%, rgb(154, 250, 218) 100%);
  min-height: 100vh;
  padding: 24vh 20px 20px;
`;

// Same header styling as previous
const Header = styled.h1`
  color: #1a3b32;
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #2a5a4a;
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 2rem;
`;

// Search bar styled to match the theme
const SearchContainer = styled.div`
  max-width: 600px;
  margin: 0 auto 3rem;
  position: relative;
`;

const SearchWrapper = styled.div`
  position: relative;
  background: white;
  border-radius: 50px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  overflow: hidden;
  border: 2px solid #6ad4b0;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1.2rem 1.5rem 1.2rem 3.5rem;
  border: none;
  outline: none;
  font-size: 1.1rem;
  background: transparent;
  
  &::placeholder {
    color: #7a7a7a;
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 1.2rem;
  top: 50%;
  transform: translateY(-50%);
  color: #3a9b7a;
  z-index: 1;
`;

// Same card styling as previous hospital cards
const ClinicCard = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #aaf0d1;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 25px 50px rgba(0,0,0,0.2);
  }
`;

const ClinicImage = styled.div`
  width: 100%;
  height: 200px;
  background: ${props => props.image ? `url(${props.image})` : 'linear-gradient(135deg, #98FB98 0%, #3EB489 100%)'};
  background-size: cover;
  background-position: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 100%);
  }
`;

const ClinicInfo = styled.div`
  padding: 1.5rem;
`;

const ClinicName = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #1a3b32;
  margin-bottom: 1rem;
`;

const DoctorName = styled.div`
  color: #4a6b60;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Specialty = styled.span`
  background: #6ad4b0;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  display: inline-block;
  margin-top: 0.5rem;
`;

const ClinicDetails = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e0f7ed;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: #f39c12;
`;

const Location = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: #4a6b60;
  font-size: 0.9rem;
`;

const Contact = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: #4a6b60;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const ViewButton = styled.button`
  background: linear-gradient(135deg, #6ad4b0 0%, #3a9b7a 100%);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(58, 155, 122, 0.3);
  }
`;

// Same grid layout as previous
const ClinicsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const NoClinicsMessage = styled.div`
  text-align: center;
  color: #1a3b32;
  font-size: 1.2rem;
  padding: 3rem;
  background: rgba(255,255,255,0.7);
  border-radius: 20px;
  border: 1px solid #c5f3e2;
  grid-column: 1 / -1;
`;

// Sample clinic data (similar structure to hospital data)
const clinicsData = [
  {
    id: 1,
    name: 'Disha Clinic',
    doctor: 'Dr. Astha Dayal',
    specialty: 'Gynaecologist',
    rating: 4.8,
    location: 'Gurgaon',
    image: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400&h=200&fit=crop',
    phone: '+91-9876543210'
  },
  {
    id: 2,
    name: "Newmi Care Clinic",
    doctor: 'Dr. Vandana Sherawat',
    specialty: 'Gynaecologist',
    rating: 4.6,
    location: 'Delhi',
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=200&fit=crop',
    phone: '+91-9876543211'
  },
  {
    id: 3,
    name: 'Blossom Women Clinic',
    doctor: 'Dr. Daksh Yadav',
    specialty: 'Pediatrician',
    rating: 4.9,
    location: 'Ghaziabad',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop',
    phone: '+91-9876543212'
  }
];

const Appointments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleClinicClick = (clinicId) => {
    window.location.href = `/appform/${clinicId}`;
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  // Filter clinics based on search term
  const filteredClinics = clinicsData.filter(clinic => 
    clinic.name.toLowerCase().includes(searchTerm) ||
    clinic.doctor.toLowerCase().includes(searchTerm) ||
    clinic.specialty.toLowerCase().includes(searchTerm) ||
    clinic.location.toLowerCase().includes(searchTerm) ||
    clinic.phone.includes(searchTerm)
  );

  return (
    <AppContainer>
      <Header>Book Your Appointment</Header>
      <Subtitle>Choose from our network of premium healthcare providers</Subtitle>

      <SearchContainer>
        <SearchWrapper>
          <SearchIcon size={20} />
          <SearchInput
            type="text"
            placeholder="Search clinics by name, doctor, specialty, location or phone..."
            onChange={handleSearch}
          />
        </SearchWrapper>
      </SearchContainer>

      <ClinicsGrid>
        {filteredClinics.length > 0 ? (
          filteredClinics.map((clinic) => (
            <ClinicCard key={clinic.id} onClick={() => handleClinicClick(clinic.id)}>
              <ClinicImage image={clinic.image} />
              
              <ClinicInfo>
                <ClinicName>{clinic.name}</ClinicName>
                <DoctorName>{clinic.doctor}</DoctorName>
                <Specialty>{clinic.specialty}</Specialty>
                
                <div>
                  <Rating>
                    <Star size={16} fill="currentColor" />
                    <span>{clinic.rating}</span>
                  </Rating>
                  <Location>
                    <MapPin size={14} />
                    <span>{clinic.location}</span>
                  </Location>
                  <Contact>
                    <Phone size={14} />
                    <span>{clinic.phone}</span>
                  </Contact>
                </div>
                
                <ClinicDetails>
                  <ViewButton>
                    Book Appointment
                    <ArrowRight size={16} />
                  </ViewButton>
                </ClinicDetails>
              </ClinicInfo>
            </ClinicCard>
          ))
        ) : (
          <NoClinicsMessage>
            <Search size={48} color="#3a9b7a" style={{ marginBottom: '1rem' }} />
            <p>No clinics found matching your search.</p>
            <p>Please try different keywords.</p>
          </NoClinicsMessage>
        )}
      </ClinicsGrid>
    </AppContainer>
  );
};

export default Appointments;