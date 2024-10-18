import React from 'react';
import parse from 'html-react-parser';

const SectionHeading = ({ title, subTitle }) => {
  return (
    <div className="container">
      <div className="st-section-heading st-style1">
        {
          title ? <h2 className="st-section-heading-title">{parse(title)}</h2> : ""
        }
        {
          subTitle ? <div className="st-seperator">
            <div className="st-seperator-left wow fadeInLeft" data-wow-duration="1s" data-wow-delay="0.2s" />
            <div className="st-seperator-center">
              <img src="/icons/4.png" alt="icon" />
            </div>
            <div className="st-seperator-right wow fadeInRight" data-wow-duration="1s" data-wow-delay="0.2s" />
          </div> : ""
        }
        {
          subTitle ? <div className="st-section-heading-subtitle">{parse(subTitle)}</div> : ""
        }
      </div>
      <div className="st-height-b40 st-height-lg-b40" />
    </div>
  )
}

export default SectionHeading
