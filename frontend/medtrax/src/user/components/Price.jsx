import { Icon } from '@iconify/react';
import React from 'react';
import { Link } from 'react-router-dom';

const Price = ({ price, title, featureList, varient }) => {
  return (
    <div className={`st-pricing-table st-style1 ${varient ? varient : ""}`}>
      <div className="st-pricing-head">
        <h2 className="st-price">${price}</h2>
        <img src="/shape/price-shape.svg" alt="shape" className="st-pricing-head-shape" />
      </div>
      {/* .st-pricing-head */}
      <div className="st-pricing-feature">
        <h2 className="st-pricing-feature-title">{title}</h2>
        <ul className="st-pricing-feature-list st-mp0">
          {
            featureList.map((element, index) => (
              <li key={index}>
                {
                  element.status === 1 ? <Icon style={{ color: "#37af47" }} icon="fa6-solid:check" /> : <Icon style={{ color: "#e6492d" }} icon="fa-solid:times" />
                }
                {element.title}
              </li>
            ))
          }
        </ul>
        <div className="st-pricing-btn">
          <Link to="" className="st-btn st-style2 st-color1 st-size-medium"> Contact Now </Link>
        </div>
        <div className="st-height-b30 st-height-lg-b30" />
      </div>
    </div>
  )
}

export default Price;
