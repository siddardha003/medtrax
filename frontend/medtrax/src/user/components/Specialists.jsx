import { Icon } from '@iconify/react';
import React from 'react';
import { Link } from 'react-router-dom';

const Specialists = ({ img, name, designation, authorLink }) => {
  return (
    <>
      <div className="st-member st-style1 st-zoom">
        <div className="st-member-img">
          <img src={img} alt={img} className="st-zoom-in" />
          <Link className="st-doctor-link" to={authorLink}>
            <i><Icon icon="fa6-solid:link" /></i>
          </Link>
          <div className="st-member-social-wrap">
            <img
              src="/shape/member-shape.svg"
              alt="shape"
              className="st-member-social-bg"
            />
            <ul className="st-member-social st-mp0">
              <li>
                <Link to="/" target="_blank">
                  <Icon icon="fa6-brands:facebook-square" />
                </Link>
              </li>
              <li>
                <Link to="/" target="_blank">
                  <Icon icon="fa6-brands:linkedin" />
                </Link>
              </li>
              <li>
                <Link to="/" target="_blank">
                  <Icon icon="fa6-brands:pinterest-square" />
                </Link>
              </li>
              <li>
                <Link to="/" target="_blank">
                  <Icon icon="fa6-brands:twitter-square" />
                </Link>
              </li>
              <li>
                <Link to="/" target="_blank">
                  <Icon icon="fa6-brands:dribbble-square" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="st-member-meta">
          <div className="st-member-meta-in">
            <h3 className="st-member-name">{name}</h3>
            <div className="st-member-designation">{designation}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Specialists;
