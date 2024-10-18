import React from 'react';
import styled from 'styled-components';

const ModeContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 10px 0;
`;

const ModeButton = styled.button`
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

const ModeSelector = ({ selectedMode, onModeChange }) => {
  const modes = ['Online', 'Offline'];

  return (
    <ModeContainer>
      {modes.map(mode => (
        <ModeButton
          key={mode}
          active={selectedMode === mode}
          onClick={() => onModeChange(mode)}
        >
          {mode}
        </ModeButton>
      ))}
    </ModeContainer>
  );
};

export default ModeSelector;
