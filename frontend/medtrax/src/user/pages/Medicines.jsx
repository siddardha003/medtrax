import styled from 'styled-components';
import { MapPin, Star, Phone, ArrowRight, Search } from 'lucide-react';
import React, { useState } from 'react';

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

const LocationSelectorContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin: 2rem auto;
  max-width: 800px;
`;

const LocationButton = styled.button`
  background: ${props => props.active ? 'linear-gradient(90deg, #008b95 0%, #86c2c6 100%)' : 'white'};
  color: ${props => props.active ? 'white' : '#666'};
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: ${props => !props.active ? '1px solid #efefef' : 'none'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const MedicalShopCard = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #efefef;
  width: 350px;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 25px 50px rgba(0,0,0,0.2);
  }
`;

const ShopImage = styled.div`
  width: 100%;
  height: 200px;
  background: ${props => props.image ? `url(${props.image})` : 'linear-gradient(90deg, #008b95 0%, #86c2c6 100%)'};
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

const ShopInfo = styled.div`
  padding: 1.5rem;
`;

const ShopName = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
`;

const ShopDetails = styled.div`
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

const ShopsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const NoShopsMessage = styled.div`
  text-align: center;
  color: #008b95;
  font-size: 1.2rem;
  padding: 3rem;
  background: rgba(255,255,255,0.7);
  border-radius: 20px;
  border: 1px solid #efefef;
  grid-column: 1 / -1;
`;

const medicalShopData = {
  Gurgaon: [
    {
      id: 1,
      name: 'Medtrax Pharmacy',
      rating: 4.7,
      location: 'Sector 14',
      phone: '+91-9876543210',
      image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=200&fit=crop'
    },
    {
      id: 2,
      name: 'Green Valley Medical Store',
      rating: 4.5,
      location: 'Sector 56',
      phone: '+91-9876543211',
      image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&h=200&fit=crop'
    },
    {
      id: 3,
      name: '24/7 Medico',
      rating: 4.8,
      location: 'Sector 23',
      phone: '+91-9876543212',
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=200&fit=crop'
    }
  ],
  Delhi: [
    {
      id: 4,
      name: 'City Med Pharmacy',
      rating: 4.6,
      location: 'Connaught Place',
      phone: '+91-9876543213',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=200&fit=crop'
    }
  ],
  Ghaziabad: [],
  Noida: [
    {
      id: 5,
      name: 'MediQuick Store',
      rating: 4.4,
      location: 'Sector 62',
      phone: '+91-9876543214',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=200&fit=crop'
    }
  ],
  Faridabad: []
};

const Medicines = () => {
  const [selectedLocation, setSelectedLocation] = useState('Gurgaon');
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleLocationChange = (location) => {
    setSelectedLocation(location);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleShopClick = (shopId) => {
    window.location.href = `/medicalshop/${shopId}`;
  };

  const shops = (medicalShopData[selectedLocation] || [])
    .filter(shop => 
      shop.name.toLowerCase().includes(searchTerm) ||
      shop.location.toLowerCase().includes(searchTerm) ||
      shop.phone.includes(searchTerm)
    );

  return (
    <AppContainer>
      <Header>Find Medical Shops</Header>
      <Subtitle>Locate pharmacies near you</Subtitle>

      <SearchContainer>
        <SearchWrapper>
          <SearchIcon size={20} />
          <SearchInput
            type="text"
            placeholder="Search medical shops by name, location or phone..."
            onChange={handleSearch}
          />
        </SearchWrapper>
      </SearchContainer>

      <LocationSelectorContainer>
        {Object.keys(medicalShopData).map(location => (
          <LocationButton
            key={location}
            active={selectedLocation === location}
            onClick={() => handleLocationChange(location)}
          >
            {location}
          </LocationButton>
        ))}
      </LocationSelectorContainer>

      <ShopsGrid>
        {shops.length > 0 ? (
          shops.map((shop) => (
            <MedicalShopCard key={shop.id} onClick={() => handleShopClick(shop.id)}>
              <ShopImage image={shop.image} />
              
              <ShopInfo>
                <ShopName>{shop.name}</ShopName>
                
                <div>
                  <Rating>
                    <Star size={16} fill="currentColor" />
                    <span>{shop.rating}</span>
                  </Rating>
                  <Location>
                    <MapPin size={14} />
                    <span>{shop.location}, {selectedLocation}</span>
                  </Location>
                  <Contact>
                    <Phone size={14} />
                    <span>{shop.phone}</span>
                  </Contact>
                </div>
                
                <ShopDetails>
                  <ViewButton>
                    View Details
                    <ArrowRight size={16} />
                  </ViewButton>
                </ShopDetails>
              </ShopInfo>
            </MedicalShopCard>
          ))
        ) : (
          <NoShopsMessage>
            <MapPin size={48} color="#008b95" style={{ marginBottom: '1rem' }} />
            <p>No medical shops found in {selectedLocation} matching your search.</p>
            <p>Please try a different location or search term.</p>
          </NoShopsMessage>
        )}
      </ShopsGrid>
    </AppContainer>
  );
};

export default Medicines;
// Sample medical shop data
