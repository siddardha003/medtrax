import React from 'react';

const LocationInMap = ({ data }) => {
  return (
    <div className="st-google-map">
      <iframe title='Google Map' src={data}></iframe>
    </div>
  )
}

export default LocationInMap;
