import { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaPhone, FaEnvelope, FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';

// Assuming you have a Logo component
const Logo = () => {
  return (
    <div className="header_logo">
      {/* Your logo content here */}
      <a href="/">
        <img src="/img/logo.png"/>
      </a>
    </div>
  );
};

// ProfileImage component
const ProfileImage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  const handleDropdownMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleDropdownMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div className="profile fixed" style={{ width: '40px', height: '40px', zIndex: 999 }}>
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <img
          src="/img/Amit_Nayak.png"
          alt="Profile"
          style={{ width: '100%', height: '100%', borderRadius: '50%' }}
        />
      </div>
      {isDropdownOpen && (
        <div
          className="dropdown-content absolute top-all bg-white shadow-md pl-12 pr-12 "
          onMouseEnter={handleDropdownMouseEnter}
          onMouseLeave={handleDropdownMouseLeave}
          style={{
            opacity: isDropdownOpen ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '90px' }}>
            <a href="#" style={{ textDecoration: 'none', color: 'black' }}><FaUser style={{ marginRight: '5px', color: '#2a303b' }} />Profile</a>
            <a href="#" style={{ textDecoration: 'none', color: 'black' }}><FaCog style={{ marginRight: '5px', color: '#2a303b' }} />Settings</a>
            <div className="dropdown-divider"></div>
            <a href="#" style={{ textDecoration: 'none', color: 'black' }}><FaSignOutAlt style={{ marginRight: '5px', color: '#2a303b' }} />Logout</a>
          </div>
        </div>
      )}
    </div>
  );
};

// Navbar component

const Navbar = () => {

  let isStudentPage = false;

    // Check if window is defined (i.e., if the code is running in the browser)
    if (typeof window !== 'undefined') {
        isStudentPage = window.location.pathname === '/home_page/student_home_page';
    }

    const handleSlotBookClick = (event) => {
      // Check if window is defined to prevent errors during server-side rendering
      if (typeof window !== 'undefined' && isStudentPage) {
          event.preventDefault();
          // Additional logic here to handle the click event, such as displaying a message or changing state
      }
  };


  const [isOpen, setIsOpen] = useState(false);
  const navbarRef = useRef(null);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const closeNavbar = (event) => {
    if (isOpen && navbarRef.current && !navbarRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', closeNavbar);
    return () => {
      document.removeEventListener('mousedown', closeNavbar);
    };
  }, [isOpen]);

  return (
    <nav ref={navbarRef} className="navbar navbar-expand-md navbar-light bg-white">
      <div className="container">
        <button
          className="navbar-toggler d-md-none"
          type="button"
          onClick={toggleNavbar} // Ensure toggleNavbar is bound to onClick event
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
          <ul className="navbar-nav ml-auto h5">
            <li className="nav-item">
              <a href="../../home_page/student_home_page" className="nav-link">Home</a>
            </li>
            <li className="nav-item h5">
              <a href="#" className="nav-link">About Us</a>
            </li>
            <li className="nav-item" id="slot-book-link">
                    <a className={"nav-link" + (isStudentPage ? " disabled" : "")} href="../../slot_booking/slot_book" onClick={handleSlotBookClick}>
                        Slot Book
                        {isStudentPage && <span className="red-circle"></span>}
                    </a>
                </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};



const Header = () => {
  return (
    <div>
      {/* First Header Line */}
      <div className="top-header-area pt-2 pb-2" style={{ backgroundColor: '#0e2737' }}>
        <div className="container">
          <div className="top-header-content d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <a href="#" className="top-header-phone-mail d-flex align-items-center text-white">
                <FaPhone style={{ color: '#59c5dc', marginRight: '23px' }} />
                <span className="phone-number d-none d-sm-inline">+91 2697 265011/12</span>
              </a>
              <a href="#" className="top-header-phone-mail d-flex align-items-center text-white pl-2">
                <FaEnvelope style={{ color: '#59c5dc', marginRight: '5px' }} />
                <span className="phone-number d-none d-sm-inline">info@charusat.ac.in</span>
              </a>
            </div>
            <div className="top-social-area d-flex justify-content-end">
              <a href="https://www.facebook.com/thecharusat/" className="text-white"><FaFacebook className="social-icon" /></a>
              <a href="https://twitter.com/thecharusat?lang=en" className="text-white"><FaTwitter className="social-icon" /></a>
              <a href="https://www.linkedin.com/school/charotar-university-of-science-&-technology-charusat-" className="text-white"><FaLinkedin className="social-icon" /></a>
              <a href="https://www.instagram.com/thecharusat/?hl=en" className="text-white"><FaInstagram className="social-icon" /></a>
            </div>
          </div>
        </div>
      </div>

      {/* Second Header Line */}
      <div className="header_second bg-white pt-2 pb-2">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <Logo />
            <Navbar />
            <div className="d-flex align-items-center">
              <a href="#" className="Envelope"><FaEnvelope /></a>
              <ProfileImage />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;