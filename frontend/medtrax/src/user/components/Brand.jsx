import React from 'react';

const Brand = ({ img, bg }) => {
  return (
    <div className={`st-logo-carousel st-style1 st-${bg}-box`}>
      <img src={img} alt={img} />
    </div>
  )
}

export default Brand;
