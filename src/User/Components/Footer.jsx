import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="ks-footer-section">
      {/* Decorative Top Gold Line */}
      <div className="ks-footer-gold-line"></div>

      <div className="ks-footer-container">
        
        {/* COLUMN 1: Brand & About */}
        <div className="ks-footer-col brand-col">
          <div className="ks-footer-logo">
            KalyanaShobha
          </div>
          <p className="ks-footer-desc">
            Bringing hearts together with trust and tradition. 
            The most secure way to find your perfect life partner.
          </p>
        </div>
        
        {/* COLUMN 2: Quick Links */}
        <div className="ks-footer-col">
          <h4 className="ks-footer-heading">Explore</h4>
          <ul className="ks-footer-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#success-stories">Success Stories</a></li>
            <li><a href="#contact">Contact Us</a></li>
          </ul>
        </div>

        {/* COLUMN 3: Legal & Support */}
        <div className="ks-footer-col">
          <h4 className="ks-footer-heading">Legal</h4>
          <ul className="ks-footer-links">
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms of Service</a></li>
            <li><a href="#refund">Refund Policy</a></li>
            <li><a href="#help">Help Center</a></li>
          </ul>
        </div>

        {/* COLUMN 4: Get in Touch */}
        <div className="ks-footer-col contact-col">
          <h4 className="ks-footer-heading">Contact</h4>
          <p className="ks-contact-item">support@kalyanashobha.com</p>
          <p className="ks-contact-item">+91 98765 43210</p>
          
                  {/*<div className="ks-social-icons">
            <a href="#" className="ks-social-btn">FB</a>
            <a href="#" className="ks-social-btn">IG</a>
            <a href="#" className="ks-social-btn">LN</a>
            <a href="#" className="ks-social-btn">YT</a>
          </div>*/}
        </div>

      </div>

      {/* COPYRIGHT AREA */}
      <div className="ks-footer-bottom">
        <p>&copy; {new Date().getFullYear()} KalyanaShobha Matrimony. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
