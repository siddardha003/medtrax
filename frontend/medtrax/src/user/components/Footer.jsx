import React, { useEffect, useState, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

// Simple Social component for displaying social links
const Social = ({ data }) => (
  <div className="st-footer-social">
    {data.map((item, idx) => (
      <a
        key={idx}
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mr-2"
        style={{ color: '#E63C3CFF' }}
        aria-label={item.label || 'Social Link'}
      >
        <Icon icon={item.icon} width={24} height={24} />
      </a>
    ))}
  </div>
);

const Footer = ({ data, variant }) => {
  const { logo, bgImg, links } = data;
  const currentYear = new Date().getFullYear();
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = useCallback(() => {
    const currentPosition = window.scrollY;
    setScrollPosition(currentPosition);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer 
      className={`st-site-footer st-sticky-footer st-dynamic-bg ${variant ? variant : ""}`}
      style={{ 
        backgroundImage: ` url(${bgImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: '#FFFFFFFF' // Light gray text for better visibility
      }}
    >
      <div className="st-main-footer">
        <div className="container">
          <div className="row">
            {/* Logo and About Section */}
            <div className="col-lg-4 col-md-6 mb-lg-0">
              <div className="st-footer-widget">
                <div className="st-text-field">
                  {logo && (
                    <>
                      <img 
                        src="images/MED-removebg-preview.png" 
                        alt="MedTrax Logo" 
                        className="st-footer-logo"
                        style={{ maxWidth: '180px' }}
                      />
                      <div className="st-height-b25 st-height-lg-b25" />
                    </>
                  )}
                  <div className="st-footer-text mb-3" style={{ color: '#000000' }}>
                    <p className="mb-2">MedTrax is a comprehensive healthcare solution provider committed to revolutionizing patient care through innovative technology.</p>
                    <p>We connect patients with healthcare providers, streamline medical services, and ensure seamless access to quality care.</p>
                  </div>
                  <div className="st-height-b25 st-height-lg-b25" />
                  {links && <Social data={links} />}
                </div>
              </div>
            </div>

            {/* Quick Links Section */}
            <div className="col-lg-2 col-md-6 mb-4 mb-lg-0">
              <div className="st-footer-widget">
                <h2 className="st-footer-widget-title mb-3" style={{ color: '#02a2ae' }}>Help & Resources</h2>
                <ul className="st-footer-widget-nav st-mp0">
                  <li className="mb-2">
                    <Link to="/faqs" className="hover:text-gray-300 transition" style={{ color: '#000000' }}>
                      <Icon icon="fa:angle-right" className="mr-2" />
                      FAQs
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/blog" className="hover:text-gray-300 transition" style={{ color: '#000000' }}>
                      <Icon icon="fa:angle-right" className="mr-2" />
                      Health Blog
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/about" className="hover:text-gray-300 transition" style={{ color: '#000000' }}>
                      <Icon icon="fa:angle-right" className="mr-2" />
                      About Us
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/privacy" className="hover:text-gray-300 transition" style={{ color: '#000000' }}>
                      <Icon icon="fa:angle-right" className="mr-2" />
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Services Section */}
            <div className="col-lg-2 col-md-6 mb-4 mb-md-0">
              <div className="st-footer-widget">
                <h2 className="st-footer-widget-title mb-3" style={{ color: '#02a2ae' }}>Quick Links</h2>
                <ul className="st-footer-widget-nav st-mp0">
                  <li className="mb-2">
                    <Link to="/" className="hover:text-gray-300 transition" style={{ color: '#000000' }}>
                      <Icon icon="fa:angle-right" className="mr-2" />
                      Home
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/hospital" className="hover:text-gray-300 transition" style={{ color: '#000000' }}>
                      <Icon icon="fa:angle-right" className="mr-2" />
                      Hospitals
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/medicalshop" className="hover:text-gray-300 transition" style={{ color: '#000000' }}>
                      <Icon icon="fa:angle-right" className="mr-2" />
                      Medical Shops
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/medicalcare" className="hover:text-gray-300 transition" style={{ color: '#000000' }}>
                      <Icon icon="fa:angle-right" className="mr-2" />
                      Medical Care
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Section */}
            <div className="col-lg-4 col-md-6">
              <div className="st-footer-widget">
                <h2 className="st-footer-widget-title mb-3" style={{ color: '#02a2ae' }}>Contact Us</h2>
                <ul className="st-footer-contact-list st-mp0">
                  <li className="mb-3 flex items-start">
                    <Icon icon="mdi:map-marker" className="mr-2 mt-1" style={{ color: '#000000' }} />
                    <p style={{ color: '#000000' }}>
                      MedTrax Healthcare Solutions<br />
                      SRKR Engineering College<br />
                      Bhimavaram, AP, India
                    </p>
                  </li>
                  <li className="mb-3 flex items-center">
                    <Icon icon="mdi:email" className="mr-2" style={{ color: '#000000' }} />
                    <a href="mailto:contact@medtrax.com" className="hover:text-gray-300 transition" style={{ color: '#000000' }}>
                     medtrax_info@gmail.com
                    </a>
                  </li>
                  <li className="mb-3 flex items-center">
                    <Icon icon="mdi:phone" className="mr-2" style={{ color: '#000000' }} />
                    <a href="tel:+18005551234" className="hover:text-gray-300 transition" style={{ color: '#000000' }}>
                      +1 (800) 555-1234
                    </a>
                  </li>
                  <li className="mb-3 flex items-center">
                    <Icon icon="mdi:clock" className="mr-2" style={{ color: '#000000' }} />
                    <p style={{ color: '#000000', marginBottom:'1px' }}>24/7 Emergency Support</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="st-copyright-wrap py-3" style={{ backgroundColor: "#EBF0EFFF" }}>
        <div className="container">
          <div className="st-copyright-in d-flex justify-content-between align-items-center">
            <div className="st-left-copyright">
              <div className="st-copyright-text" style={{ color: '#02a2ae' }}>
                &copy; {currentYear} MedTrax Healthcare Solutions. All Rights Reserved.
              </div>
            </div>
            <div className="st-right-copyright">
              <div 
                id="st-backtotop" 
                className="hover:bg-opacity-30 transition rounded-full w-10 h-10 flex items-center justify-center cursor-pointer"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  transform: `scale(${scrollPosition >= 100 ? "1" : "0"})`,
                  transition: 'transform 0.3s ease, background-color 0.3s ease'
                }} 
                onClick={scrollToTop}
              >
                <Icon icon="fa6-solid:angle-up" style={{ color: '#02a2ae' }} className="text-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;