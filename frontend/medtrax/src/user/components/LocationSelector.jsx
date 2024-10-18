import React from 'react';
import styled from 'styled-components';

const LocationContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 10px 0;
`;

const LocationButton = styled.button`
  background-color: ${props => (props.active ? '#22baaf' : '#b6d5db')};
  border: none;
  padding: 10px 15px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #22baaf;
  }
`;

const LocationSelector = ({ selectedLocation, onLocationChange }) => {
  const locations = ['Gurgaon', 'Ghaziabad', 'Delhi', 'Noida', 'Faridabad'];

  return (
    <LocationContainer>
      {locations.map(location => (
        <LocationButton
          key={location}
          active={selectedLocation === location}
          onClick={() => onLocationChange(location)}
        >
          {location}
        </LocationButton>
      ))}
    </LocationContainer>
  );
};

export default LocationSelector;
