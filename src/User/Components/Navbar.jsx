import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in (Token check)
  const isLoggedIn = !!localStorage.getItem('token');

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    setIsOpen(false); // Close menu
    navigate('/'); // Redirect to Home
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
           {/* Left Side: Logo */}
        <div className="an-navbar-logo">
          <Link to="/">
             <img src="/kalyanashobha.png" alt="Kalyana Shobha" />
          </Link>
        </div>

        {/* Right Side: Desktop Links */}
        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>

          {/* 1. AGENT OPTION: Only show when NO USER is logged in */}
          {!isLoggedIn && (
            <li><Link to="/agent/login">Agent</Link></li>
          )}

          {/* 2. LOGGED IN USER OPTIONS */}
          {isLoggedIn && (
            <>
              <li><Link to="/myprofile">My Profile</Link></li>
              <li><Link to="/interests">Interests</Link></li>
              <li><Link to="/payments">Payments</Link></li>
              {/* VENDORS: Only show when logged in */}
              <li><Link to="/vendor">Vendors</Link></li>
            </>
          )}

          {isLoggedIn ? (
            <li>
              <button onClick={handleLogout} className="nav-btn">Logout</button>
            </li>
          ) : (
            <li><Link to="/login" className="nav-btn">Login</Link></li>
          )}
        </ul>

        {/* Mobile Menu Icon (Hamburger) */}
        <div className={`hamburger ${isOpen ? 'is-active' : ''}`} onClick={toggleMenu}>
          <span className="line line-1"></span>
          <span className="line line-2"></span>
          <span className="line line-3"></span>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className={`mobile-menu ${isOpen ? 'is-open' : ''}`}>
        <ul className="mobile-links">
          <li><Link to="/" onClick={toggleMenu}>Home</Link></li>

          {/* AGENT: Only show in sidebar if NOT logged in */}
          {!isLoggedIn && (
            <li><Link to="/agent/login" onClick={toggleMenu}>Agent</Link></li>
          )}

          {isLoggedIn && (
            <>
              <li><Link to="/myprofile" onClick={toggleMenu}>My Profile</Link></li>
              <li><Link to="/interests" onClick={toggleMenu}>Interests</Link></li>
              <li><Link to="/payments" onClick={toggleMenu}>Payments</Link></li>
              {/* VENDORS: Show in sidebar only when logged in */}
              <li><Link to="/vendor" onClick={toggleMenu}>Vendors</Link></li>
            </>
          )}

          {isLoggedIn ? (
            <li className="mobile-btn-wrapper">
              <button onClick={handleLogout} className="nav-btn mobile-btn">Logout</button>
            </li>
          ) : (
            <li className="mobile-btn-wrapper">
              <Link to="/login" onClick={toggleMenu} className="nav-btn mobile-btn">Login</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
