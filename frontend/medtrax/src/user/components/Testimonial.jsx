import { Icon } from '@iconify/react';
import React from 'react';

const Testimonial = ({ img, name, designation, subTitle, varient }) => {
  return (
    <div className={`st-testimonial st-style1 ${varient} wow fadeInLeft`} data-wow-duration="0.8s" data-wow-delay="0.2s" >
      <div className="st-testimonial-info">
        <div className="st-testimonial-img">
          <img src={img} alt={img} />
        </div>
        <div className="st-testimonial-meta">
          <h4 className="st-testimonial-name">{name}</h4>
          <div className="st-testimonial-designation">{designation}</div>
        </div>
      </div>
      <div className="st-testimonial-text">{subTitle}</div>
      <div className="st-quote">
        <Icon icon="fa-solid:quote-right" />
      </div>
    </div>
  )
}

export default Testimonial;
