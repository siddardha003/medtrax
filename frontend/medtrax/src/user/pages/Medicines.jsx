import styled from 'styled-components';
import { MapPin, Star, Phone, ArrowRight, Search } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { getPublicShopsApi } from '../../Api';
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



const MedicalShopCard = styled.div`
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

const ShopImage = styled.div`
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
  background: #008b95;
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

const Medicines = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  const navigate = useNavigate();
  
  // Enhanced fallback data for when API fails
  const fallbackShopsData = [
    {
      _id: 'shop-fallback1',
      name: 'MediCare Pharmacy',
      rating: 4.6,
      address: {
        city: 'Mumbai',
        state: 'Maharashtra'
      },
      contactPhone: '+91-9876543220',
      images: ['https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&h=200&fit=crop']
    },
    {
      _id: 'shop-fallback2',
      name: 'HealthPlus Medical Store',
      rating: 4.4,
      address: {
        city: 'Delhi',
        state: 'Delhi'
      },
      contactPhone: '+91-9876543221',
      images: ['https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=200&fit=crop']
    },
    {
      _id: 'shop-fallback3',
      name: 'City Pharmacy',
      rating: 4.2,
      address: {
        city: 'Bangalore',
        state: 'Karnataka'
      },
      contactPhone: '+91-9876543222',
      images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=200&fit=crop']    }
  ];
  
  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        const response = await getPublicShopsApi();
        console.log('Medicines API Response:', response.data); // Debug log
        
        if (response.data && response.data.success) {
          const shopsData = response.data.data.shops || [];
          // Ensure we always set an array
          setShops(Array.isArray(shopsData) ? shopsData : []);
          console.log('Shops loaded for medicines:', shopsData.length); // Debug log
        } else {
          throw new Error('Invalid API response structure');
        }
      } catch (error) {
        console.error('Error fetching shops:', error);
        setError(error.message);
        // Fallback to static data if API fails
        setShops(fallbackShopsData);
      } finally {
        setLoading(false);
      }
    };
    
    fetchShops();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };
  const handleShopClick = (shopId) => {
    navigate(`/MedicalshopDetails?shopId=${shopId}`);
  };const filteredShops = Array.isArray(shops) ? shops.filter(shop => {
    const name = shop.name || '';
    const phone = shop.phone || shop.contactPhone || '';
    const address = shop.address || {};
    const location = `${address.city || shop.city || ''} ${address.state || shop.state || ''}`.trim();
    
    return name.toLowerCase().includes(searchTerm) ||
           location.toLowerCase().includes(searchTerm) ||
           phone.includes(searchTerm);
  }) : [];

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
      </SearchContainer>      {loading ? (
        <NoShopsMessage>Loading medical shops...</NoShopsMessage>
      ) : error ? (
        <NoShopsMessage>Error loading shops. Please try again later.</NoShopsMessage>
      ) : (
        <ShopsGrid>
          {filteredShops.length > 0 ? (
            filteredShops.map((shop) => (
              <MedicalShopCard key={shop._id || shop.id} onClick={() => handleShopClick(shop._id || shop.id)}>
                <ShopImage image={shop.images?.[0] || shop.image} />
                
                <ShopInfo>
                  <ShopName>{shop.name}</ShopName>
                  
                  <div>
                    <Rating style={{marginBottom: '8px'}}>
                      <Star size={16} fill="currentColor" />
                      <span >{shop.rating || 'N/A'}</span>
                    </Rating>                    <Location>
                      <MapPin size={14} />
                      <span>{shop.address ? `${shop.address.city}, ${shop.address.state}` : shop.city ? `${shop.city}, ${shop.state}` : shop.location}</span>
                    </Location>
                    <Contact>
                      <Phone size={14} />
                      <span>{shop.phone || shop.contactPhone}</span>
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
              <Search size={48} color="#008b95" style={{ marginBottom: '1rem' }} />
              <p>No medical shops found matching your search.</p>              <p>Please try different keywords.</p>
            </NoShopsMessage>
          )}
        </ShopsGrid>
      )}
    </AppContainer>
  );
};

export default Medicines;
// Sample medical shop data
