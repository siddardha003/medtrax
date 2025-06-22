import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MapPin, Star, Phone, ArrowRight, Search } from 'lucide-react';
import { getPublicHospitalsApi } from '../../Api';
import { useNavigate } from 'react-router-dom';

const AppContainer = styled.div`
  background: #f8f9fa;
  min-height: 100vh;
  padding: 24vh 20px 20px;
`;

const Header = styled.h1`
  color: #008b95;
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #4a6b60;
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 2rem;
`;

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
  border: 2px solid #86c2c6;
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
  color: #008b95;
  z-index: 1;
`;

const ClinicCard = styled.div`
  background: white;
  padding: 10px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #efefef;
  padding: 8px; /* This creates the gap around the image */
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0,0,0,0.12);
  }
`;

const ClinicImage = styled.div`
  width: calc(100% - 20px); /* Adjust for the padding */
  height: 200px;
  margin: 0 auto; /* Center the image */
  background: ${props => props.image ? `url(${props.image})` : 'linear-gradient(90deg, #008b95 0%, #86c2c6 100%)'};
  background-size: cover;
  background-position: center;
  position: relative;
  border-radius: 12px; /* Slightly less than card radius for inner border effect */
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.1) 100%);
  }
`;

const ClinicInfo = styled.div`
  padding: 1.5rem;
`;

const ClinicName = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
`;

const ClinicDetails = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #efefef;
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
  color: #666;
  font-size: 0.9rem;
`;

const Contact = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: #666;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const ViewButton = styled.button`
  background: linear-gradient(90deg, #008b95 0%, #86c2c6 100%);
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
    box-shadow: 0 5px 15px rgba(0, 139, 149, 0.3);
    background: linear-gradient(90deg, #007a82 0%, #76b2b6 100%);
  }
`;

const ClinicsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const NoClinicsMessage = styled.div`
  text-align: center;
  color: #008b95;
  font-size: 1.2rem;
  padding: 3rem;
  background: rgba(255,255,255,0.7);
  border-radius: 20px;
  border: 1px solid #efefef;
  grid-column: 1 / -1;
`;


// Sample clinic data (fallback if API fails)
const fallbackClinicsData = [
  {
    _id: 'fallback1',
    name: 'City General Hospital',
    rating: 4.8,
    address: {
      city: 'Mumbai',
      state: 'Maharashtra'
    },
    images: ['https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400&h=200&fit=crop'],
    phone: '+91-9876543210',
    contactPhone: '+91-9876543210'
  },
  {
    _id: 'fallback2',
    name: "Apollo Medical Center",
    rating: 4.7,
    address: {
      city: 'Delhi',
      state: 'Delhi'
    },
    images: ['https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=200&fit=crop'],
    phone: '+91-9876543211',
    contactPhone: '+91-9876543211'
  },
  {
    _id: 'fallback3',
    name: "Max Healthcare",
    rating: 4.6,
    address: {
      city: 'Bangalore',
      state: 'Karnataka'
    },
    images: ['https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=200&fit=crop'],
    phone: '+91-9876543212',
    contactPhone: '+91-9876543212'
  }
];

const Appointments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        setLoading(true);
        const response = await getPublicHospitalsApi();
        console.log('Appointments API Response:', response.data); // Debug log
        
        if (response.data && response.data.success) {
          const hospitalsData = response.data.data.hospitals || [];
          // Ensure we always set an array
          setClinics(Array.isArray(hospitalsData) ? hospitalsData : []);
          console.log('Hospitals loaded for appointments:', hospitalsData.length); // Debug log
        } else {
          throw new Error('Invalid API response structure');
        }
      } catch (error) {
        console.error('Error fetching clinics:', error);
        setError(error.message);
        // Fallback to static data if API fails
        setClinics(fallbackClinicsData);
      } finally {
        setLoading(false);
      }
    };

    fetchClinics();
  }, []);
    const handleClinicClick = (clinicId) => {
    const selectedClinic = clinics.find(clinic => clinic._id === clinicId || clinic.id === clinicId);
    navigate(`/appform?hospitalId=${clinicId}`, { 
      state: { hospital: selectedClinic } 
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };
  const filteredClinics = Array.isArray(clinics) ? clinics.filter(clinic => {
    const name = clinic.name || '';
    const phone = clinic.phone || '';
    const address = clinic.address || {};
    const location = `${address.city || ''} ${address.state || ''}`.trim();
    const specialty = clinic.specialties ? clinic.specialties.join(' ') : '';
    
    return name.toLowerCase().includes(searchTerm) ||
           specialty.toLowerCase().includes(searchTerm) ||
           location.toLowerCase().includes(searchTerm) ||
           phone.includes(searchTerm);
  }) : [];
  return (
    <AppContainer>
      <Header>Book Your Appointment</Header>
      <Subtitle>Choose from our network of premium healthcare providers</Subtitle>

      <SearchContainer>
        <SearchWrapper>
          <SearchIcon size={20} />
          <SearchInput
            type="text"
            placeholder="Search hospitals by name, specialty, location or phone..."
            onChange={handleSearch}
          />
        </SearchWrapper>
      </SearchContainer>

      {loading ? (
        <NoClinicsMessage>Loading hospitals...</NoClinicsMessage>
      ) : error ? (
        <NoClinicsMessage>Error loading hospitals. Showing sample data.</NoClinicsMessage>
      ) : (
        <ClinicsGrid>
          {filteredClinics.length > 0 ? (
            filteredClinics.map((clinic) => (
              <ClinicCard key={clinic._id || clinic.id} onClick={() => handleClinicClick(clinic._id || clinic.id)}>
                <ClinicImage image={clinic.images?.[0] || clinic.image} />
                
                <ClinicInfo>
                  <ClinicName>{clinic.name}</ClinicName>
                  
                  <div>
                    <Rating>
                      <Star size={16} fill="currentColor" />
                      <span>{clinic.rating || '4.5'}</span>
                    </Rating>
                    <Location>
                      <MapPin size={14} />
                      <span>{clinic.address ? `${clinic.address.city}, ${clinic.address.state}` : clinic.location}</span>
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
              <Search size={48} color="#008b95" style={{ marginBottom: '1rem' }} />
              <p>No hospitals found matching your search.</p>
              <p>Please try different keywords.</p>
            </NoClinicsMessage>
          )}
        </ClinicsGrid>
      )}
    </AppContainer>
  );
};

export default Appointments;
