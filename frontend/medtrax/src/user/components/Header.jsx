import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logOut } from '../../Redux/user/actions';

const Header = ({ data }) => {
  const {logo} = data;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, userInfo } = useSelector(state => state.user || {});
  const isLoggedIn = token && userInfo?.id;
  
  const [mobileToggle, setMobileToggle] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isSticky, setIsSticky] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleMobileToggle = () => {
    setMobileToggle(!mobileToggle);
  };  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const handleLogout = () => {
    if (isLoggingOut) {
      console.log('Logout already in progress, ignoring duplicate call');
      return;
    }
    
    console.log('Logout button clicked');
    setIsLoggingOut(true);
    
    // Clear user data
    dispatch(logOut());
    // Close dropdown
    setShowProfileDropdown(false);
    // Navigate to home page
    navigate('/');
    
    // Reset flag after a short delay
    setTimeout(() => {
      setIsLoggingOut(false);
    }, 1000);
  };const navigateToDashboard = () => {
    console.log('Navigating to dashboard, user role:', userInfo?.role, 'isAdmin:', userInfo?.isAdmin);
    
    if (userInfo?.isAdmin) {
      // Admin users go to their specific dashboard
      const userRole = userInfo?.role;
      switch (userRole) {
        case 'super_admin':
          navigate('/admin-panel');
          break;
        case 'hospital_admin':
          navigate('/hospital-dashboard');
          break;
        case 'shop_admin':
          navigate('/shop-dashboard');
          break;
        default:
          // Fallback to homepage for unknown admin roles
          navigate('/');
          break;
      }    } else {
      // For regular users, go to homepage
      navigate('/');
    }
    setShowProfileDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const windowTop = window.scrollY || document.documentElement.scrollTop;

      if (windowTop >= headerHeight) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }

      setLastScrollTop(windowTop);
    };

    const headerHeight = document.querySelector('.st-sticky-header').offsetHeight + 100;

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isSticky, lastScrollTop]);

  return (
    <header className={`st-site-header st-style1 st-sticky-header ${isSticky ? "st-sticky-active" : ""}`}>
      <div className="st-top-header">
        <div className="container">
          <div className="st-top-header-in">
            <ul className="st-top-header-list">
              <li>
                <svg
                  enableBackground="new 0 0 479.058 479.058"
                  viewBox="0 0 479.058 479.058"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m434.146 59.882h-389.234c-24.766 0-44.912 20.146-44.912 44.912v269.47c0 24.766 20.146 44.912 44.912 44.912h389.234c24.766 0 44.912-20.146 44.912-44.912v-269.47c0-24.766-20.146-44.912-44.912-44.912zm0 29.941c2.034 0 3.969.422 5.738 1.159l-200.355 173.649-200.356-173.649c1.769-.736 3.704-1.159 5.738-1.159zm0 299.411h-389.234c-8.26 0-14.971-6.71-14.971-14.971v-251.648l199.778 173.141c2.822 2.441 6.316 3.655 9.81 3.655s6.988-1.213 9.81-3.655l199.778-173.141v251.649c-.001 8.26-6.711 14.97-14.971 14.97z" />
                </svg>
                <Link to='/Contact'> medtrax_info@gmail.com </Link>
              </li>
            </ul>
            {isLoggedIn ? (
              <div className="relative flex items-center" ref={dropdownRef}>
                <button 
                  className="st-top-header-btn st-smooth-move flex items-center gap-2 mr-2" 
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                >
                  {userInfo?.isAdmin ? (
                    <span className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white font-medium" title={`${userInfo.role}`}>
                      {userInfo?.role?.charAt(0).toUpperCase() || 'A'}
                    </span>
                  ) : (
                    <span className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white font-medium">
                      {userInfo?.name?.charAt(0) || 'U'}
                    </span>
                  )}
                </button>
                
                <button 
                  onClick={handleLogout}
                  className="bg-red-600 text-white py-1 px-3 rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
                  {showProfileDropdown && (
                  <div className="absolute right-0 top-10 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{userInfo.name || userInfo.email}</p>
                      <p className="text-xs text-gray-500">{userInfo.email}</p>
                      {userInfo?.isAdmin && (
                        <p className="text-xs font-semibold text-blue-600 mt-1">
                          {userInfo.role === 'super_admin' ? 'Super Admin' : 
                           userInfo.role === 'hospital_admin' ? 'Hospital Admin' : 
                           userInfo.role === 'shop_admin' ? 'Shop Admin' : 'Admin'}
                        </p>
                      )}
                    </div>
                    
                    <button 
                      onClick={navigateToDashboard} 
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {userInfo?.isAdmin ? (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          Go to Admin Dashboard
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          My Account
                        </>
                      )}
                    </button>
                    
                    <button 
                      onClick={handleLogout} 
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                )}</div>            ) : (
              <div className="flex items-center space-x-3">
                <Link className="st-top-header-btn st-smooth-move" to="/login">Login</Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="st-main-header">
        <div className="container">
          <div className="st-main-header-in">
            <div className="st-main-header-left">
              <Link to='/' className="st-site-branding" >
                <img src={`/images/MED-removebg-preview.png`} alt={logo} />
              </Link>
            </div>
            <div className="st-main-header-right">
              <div className="st-nav">
                <ul className={`st-nav-list st-onepage-nav ${mobileToggle ? "d-block" : "none"}`}>
                  <li>
                    <Link to="/" spy={true} duration={500} onClick={() => setMobileToggle(false)} >Home</Link>
                  </li>
            
                  <li>
                    <Link to="/Hospital" spy={true} duration={500} onClick={() => setMobileToggle(false)} >Hospitals</Link>
                  </li>
                  <li>
                    <Link to="/Appointments" spy={true} duration={500} onClick={() => setMobileToggle(false)} >Appointment</Link>
                  </li>
                  <li>
                    <Link to="/Medicines" spy={true} duration={500} onClick={() => setMobileToggle(false)} >Medicines</Link>
                  </li>
                  <li>
                    <Link to="/MedicalCare" spy={true} duration={500} onClick={() => setMobileToggle(false)} >Medical Care</Link>
                  </li>
                  <li>
                    <Link to="/About" spy={true} duration={500} onClick={() => setMobileToggle(false)} >About</Link>
                  </li>
                  <li>
                    <Link to="/Contact" spy={true} duration={500} onClick={() => setMobileToggle(false)} >Contact</Link>
                  </li>
                </ul>
                <div className={`st-munu-toggle ${mobileToggle ? "st-toggle-active" : ""} `} onClick={handleMobileToggle}>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header;
