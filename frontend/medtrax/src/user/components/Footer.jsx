import React, { useEffect, useState } from 'react';
import Social from './Social';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';




const Footer = ({ data, varient }) => {
  const { logo, subTitle, bgImg, links } = data;
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  const [scrollPosition, setScrollPosition] = useState(0);


  const handleScroll = () => {
    const currentPosition = window.scrollY;
    setScrollPosition(currentPosition);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className={`st-site-footer st-sticky-footer st-dynamic-bg ${varient ? varient : ""}`}
      style={{ backgroundImage: `url(${bgImg})` }}>
      <div className="st-main-footer">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <div className="st-footer-widget">
                <div className="st-text-field">
                  <img src={logo} alt={logo} className="st-footer-logo" />
                  <div className="st-height-b25 st-height-lg-b25" />
                  <div className="st-footer-text">{subTitle}</div>
                  <div className="st-height-b25 st-height-lg-b25" />
                  <Social data={links} />
                </div>
              </div>
            </div>
            {/* .col */}
            <div className="col-lg-3">
              <div className="st-footer-widget">
                <h2 className="st-footer-widget-title">Useful Links</h2>
                <ul className="st-footer-widget-nav st-mp0">
                  <li>
                    <Link to="">
                      <Icon icon="fa:angle-right" />
                      FAQs
                    </Link>
                  </li>
                  <li>
                    <Link to="">
                      <Icon icon="fa:angle-right" />
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link to="">
                      <Icon icon="fa:angle-right" />
                      Weekly timetable
                    </Link>
                  </li>
                  <li>
                    <Link to="">
                      <Icon icon="fa:angle-right" />
                      Terms &amp; Conditions
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            {/* .col */}
            <div className="col-lg-3">
              <div className="st-footer-widget">
                <h2 className="st-footer-widget-title">Departments</h2>
                <ul className="st-footer-widget-nav st-mp0">
                  <li>
                    <Link to="">
                      <Icon icon="fa:angle-right" />
                      Rehabilitation
                    </Link>
                  </li>
                  <li>
                    <Link to="">
                      <Icon icon="fa:angle-right" />
                      Laboratory Analysis
                    </Link>
                  </li>
                  <li>
                    <Link to="">
                      <Icon icon="fa:angle-right" />
                      Face Lift Surgery
                    </Link>
                  </li>
                  <li>
                    <Link to="">
                      <Icon icon="fa:angle-right" />
                      Liposuction
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            {/* .col */}
            <div className="col-lg-3">
              <div className="st-footer-widget">
                <h2 className="st-footer-widget-title">Contacts</h2>
                <ul className="st-footer-contact-list st-mp0">
                  <li>
                    <span className="st-footer-contact-title">Address:</span> 1223
                    Fulton Street San Diego CA 941-23 USA
                  </li>
                  <li>
                    <span className="st-footer-contact-title">Email:</span>{" "}
                    nischinto@Gmail.Com
                  </li>
                  <li>
                    <span className="st-footer-contact-title">Phone:</span> (+01) -
                    234 567 890 <br />
                    (+01) - 345 678 901
                  </li>
                </ul>
              </div>
            </div>
            {/* .col */}
          </div>
        </div>
      </div>
      <div className="st-copyright-wrap">
        <div className="container">
          <div className="st-copyright-in">
            <div className="st-left-copyright">
              <div className="st-copyright-text">
                Copyright {currentYear}. Design by Laralink
              </div>
            </div>
            <div className="st-right-copyright">
              <div id="st-backtotop" style={{ scale: `${scrollPosition >= 100 ? "1" : "0"}` }} onClick={scrollToTop}>
                <Icon icon="fa6-solid:angle-up" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
