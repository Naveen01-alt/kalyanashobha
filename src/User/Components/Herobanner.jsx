import React from 'react';
import './Herobanner.css';
import { Link } from "react-router-dom";

const HeroBanner = () => {
  return (
    <div className="hero-section">
      
      {/* 1. TEXTURE & BACKGROUND */}
      <div className="film-grain"></div>

      {/* 2. MOVING STAR FIELD */}
      <div className="star-field">
        <div className="stars-small"></div>   {/* Distant White Stars */}
        <div className="stars-medium"></div>  {/* Closer Gold Stars */}
      </div>

      {/* 3. PHANTOM IMAGE */}
      <div className="phantom-wrapper">
        <img src="/banner1.png" alt="Luxury Matrimony" className="phantom-image" />
        <div className="phantom-overlay"></div>
      </div>

      {/* 4. CONTENT LAYER - DIFFERENT TEXT STRUCTURE */}
      <div className="hero-content">
        
        {/* Brand Tagline */}
        <div className="brand-tag-container reveal-text delay-1">



        </div>

        {/* Main Title - Changed Text */}
        <h1 className="hero-title">
          <div className="text-mask">
            <span className="reveal-text delay-2">Where Souls</span>
          </div>
          <div className="text-mask">
            <span className="reveal-text delay-3 gold-gradient">Meet Eternity</span>
          </div>
        </h1>

        {/* Subtitle - Changed Text */}
        <div className="text-mask subtitle-mask">
          <p className="hero-subtitle reveal-text delay-4">
            An exclusive journey for those seeking meaningful connections.<br className="desktop-break" />
            Discover a love that transcends time and tradition.
          </p>
        </div>

        {/* Action Button */}
        <div className="action-wrapper reveal-anim delay-5">
          <Link to="/registration">
            <button className="magnetic-btn">
              <span className="btn-text">Register Now</span>
              <div className="btn-fill"></div>
            </button>
          </Link>
        </div>
        
      </div>
    </div>
  );
};

export default HeroBanner;
