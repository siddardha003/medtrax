import React from 'react';
import { Link } from 'react-router-dom';

const ScrollLink = ({ to, children, className, onClick, ...props }) => {
  const handleClick = (e) => {
    console.log('ScrollLink: Clicked on link to:', to);
    
    // Call the original onClick if provided
    if (onClick) {
      onClick(e);
    }
    
    // Force scroll to top
    setTimeout(() => {
      console.log('ScrollLink: Attempting to scroll to top');
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      console.log('ScrollLink: Scroll completed');
    }, 0);
  };

  return (
    <Link 
      to={to} 
      className={className} 
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
};

export default ScrollLink; 