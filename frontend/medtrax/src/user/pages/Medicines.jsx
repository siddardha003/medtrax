import styled from 'styled-components';
import { MapPin, Star, Phone, ArrowRight, Search } from 'lucide-react';
import React, { useState } from 'react';

// Using the exact same background as previous designs
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

// Location selector styled to match the theme
const LocationSelectorContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin: 2rem auto;
  max-width: 800px;
`;

const LocationButton = styled.button`
  background: ${props => props.active ? 'linear-gradient(135deg, #6ad4b0 0%, #3a9b7a 100%)' : 'white'};
  color: ${props => props.active ? 'white' : '#4a6b60'};
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

// Same card styling as previous designs
const MedicalShopCard = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #aaf0d1;
  width: 350px;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 25px 50px rgba(0,0,0,0.2);
  }
`;

const ShopImage = styled.div`
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

const ShopInfo = styled.div`
  padding: 1.5rem;
`;

const ShopName = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #1a3b32;
  margin-bottom: 1rem;
`;

const ShopDetails = styled.div`
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
const ShopsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const NoShopsMessage = styled.div`
  text-align: center;
  color: #1a3b32;
  font-size: 1.2rem;
  padding: 3rem;
  background: rgba(255,255,255,0.7);
  border-radius: 20px;
  border: 1px solid #c5f3e2;
  grid-column: 1 / -1;
`;

// Sample medical shop data
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

  // Filter shops based on selected location and search term
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
            <MapPin size={48} color="#3a9b7a" style={{ marginBottom: '1rem' }} />
            <p>No medical shops found in {selectedLocation} matching your search.</p>
            <p>Please try a different location or search term.</p>
          </NoShopsMessage>
        )}
      </ShopsGrid>
    </AppContainer>
  );
};

export default Medicines;