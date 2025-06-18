import React, { useState } from 'react';
import styled from 'styled-components';
import { Search, MapPin, Star, Phone, ArrowRight } from 'lucide-react';

const AppContainer = styled.div`
  background: #9cf7cd;
  min-height: 100vh;
  padding: 24vh 20px 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  color: #1a3b32;
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #2a5a4a;
  font-size: 1.2rem;
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
  box-shadow: 0 5px 15px rgba(0,0,0,0.08);
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

const RecommendedSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  color: #1a3b32;
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 2rem;
`;

const HospitalsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
`;

const HospitalCard = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #c5f3e2;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0,0,0,0.12);
  }
`;

const HospitalImage = styled.div`
  width: 100%;
  height: 200px;
  background: ${props => props.image ? `url(${props.image})` : 'linear-gradient(135deg, #9cf7cd 0%, #6ad4b0 100%)'};
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
    background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.1) 100%);
  }
`;

const HospitalInfo = styled.div`
  padding: 1.5rem;
`;

const HospitalName = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #1a3b32;
  margin-bottom: 1rem;
`;

const HospitalDetails = styled.div`
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

const NoResults = styled.div`
  text-align: center;
  color: #1a3b32;
  font-size: 1.2rem;
  padding: 3rem;
  background: rgba(255,255,255,0.7);
  border-radius: 20px;
  border: 1px solid #c5f3e2;
`;

const hospitalData = [
  {
    id: 1,
    name: 'Harmony Health Center',
    rating: 4.8,
    location: 'Gurgaon',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=200&fit=crop',
    phone: '+91-9876543210'
  },
  {
    id: 2,
    name: 'Tranquil Care Hospital',
    rating: 4.6,
    location: 'Delhi',
    image: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400&h=200&fit=crop',
    phone: '+91-9876543211'
  },
  {
    id: 3,
    name: 'Serenity Medical Center',
    rating: 4.9,
    location: 'Noida',
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=200&fit=crop',
    phone: '+91-9876543212'
  },
  {
    id: 4,
    name: 'Verdant Wellness Hospital',
    rating: 4.7,
    location: 'Faridabad',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=200&fit=crop',
    phone: '+91-9876543213'
  },
  {
    id: 5,
    name: 'Pure Life Medical',
    rating: 4.5,
    location: 'Ghaziabad',
    image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&h=200&fit=crop',
    phone: '+91-9876543214'
  },
  {
    id: 6,
    name: 'Fresh Start Healthcare',
    rating: 4.4,
    location: 'Delhi',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop',
    phone: '+91-9876543215'
  }
];

const HospitalFinder = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredHospitals, setFilteredHospitals] = useState(hospitalData);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setFilteredHospitals(hospitalData);
    } else {
      const filtered = hospitalData.filter(hospital =>
        hospital.name.toLowerCase().includes(term.toLowerCase()) ||
        hospital.location.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredHospitals(filtered);
    }
  };

  const handleHospitalClick = (hospitalId) => {
    // Navigate to hospital details page
    window.location.href = `/hospital-details/${hospitalId}`;
  };

  return (
    <AppContainer>
      <Header>
        <Title>Find Your Hospital</Title>
        <Subtitle>Discover healing in our serene healthcare network</Subtitle>
      </Header>

      <SearchContainer>
        <SearchWrapper>
          <SearchIcon size={20} />
          <SearchInput
            type="text"
            placeholder="Search hospitals or locations..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </SearchWrapper>
      </SearchContainer>

      <RecommendedSection>
        <SectionTitle>
          {searchTerm ? `Search Results (${filteredHospitals.length})` : 'Recommended Hospitals'}
        </SectionTitle>
        
        {filteredHospitals.length > 0 ? (
          <HospitalsGrid>
            {filteredHospitals.map((hospital) => (
              <HospitalCard key={hospital.id} onClick={() => handleHospitalClick(hospital.id)}>
                <HospitalImage image={hospital.image} />
                
                <HospitalInfo>
                  <HospitalName>{hospital.name}</HospitalName>
                  
                  <div>
                    <Rating>
                      <Star size={16} fill="currentColor" />
                      <span>{hospital.rating}</span>
                    </Rating>
                    <Location>
                      <MapPin size={14} />
                      <span>{hospital.location}</span>
                    </Location>
                    <Contact>
                      <Phone size={14} />
                      <span>{hospital.phone}</span>
                    </Contact>
                  </div>
                  
                  <HospitalDetails>
                    <ViewButton>
                      View Details
                      <ArrowRight size={16} />
                    </ViewButton>
                  </HospitalDetails>
                </HospitalInfo>
              </HospitalCard>
            ))}
          </HospitalsGrid>
        ) : (
          <NoResults>
            <Search size={48} style={{ marginBottom: '1rem', color: '#3a9b7a' }} />
            <p>No hospitals found matching your search.</p>
            <p>Try different keywords or check your spelling.</p>
          </NoResults>
        )}
      </RecommendedSection>
    </AppContainer>
  );
};

export default HospitalFinder;