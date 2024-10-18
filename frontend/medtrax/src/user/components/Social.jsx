import { Icon } from '@iconify/react';
import React from 'react';
import { Link } from 'react-router-dom';

const Social = () => {
  return (
    <ul className="st-social-btn st-style1 st-mp0">
      <li>
        <Link to='' target='_blank'>
          <Icon icon="fa6-brands:square-facebook" />
        </Link>
      </li>
      <li>
        <Link to='' target='_blank'>
          <Icon icon="fa6-brands:linkedin" />
        </Link>
      </li>
      <li>
        <Link to='' target='_blank'>
          <Icon icon="fa6-brands:pinterest-square" />
        </Link>
      </li>
      <li>
        <Link to='' target='_blank'>
          <Icon icon="fa6-brands:twitter-square" />
        </Link>
      </li>
    </ul>
  )
}

export default Social;
