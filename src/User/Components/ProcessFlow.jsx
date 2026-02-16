import React from 'react';
import './ProcessFlow.css';

const ProcessFlow = () => {
  const steps = [
    {
      id: 1,
      title: "User Registration",
      desc: "Users create their account and complete their profile details.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
          <path d="M16 11l2 2 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 2,
      title: "Profile Browsing",
      desc: "Users explore verified profiles using advanced filters.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
          <path d="M11 8v6M8 11h6" />
        </svg>
      )
    },
    {
      id: 3,
      title: "Interest Requests",
      desc: "Users send interest to connect with matching profiles.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          <path d="M12 5.67v-2" strokeDasharray="2 2" />
          <path d="M12 21.23v2" strokeDasharray="2 2" />
        </svg>
      )
    },
    {
      id: 4,
      title: "Get Contact",
      desc: "When interest is accepted, view contact details & connect.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          <path d="M12 15v2" strokeLinecap="round" />
        </svg>
      )
    }
  ];

  return (
    <section className="process-section">
      <div className="process-container">
        
        {/* Section Header */}
        <div className="process-header">

          <h2 className="process-title">Our Matrimony <span className="gold-text">Process</span></h2>
          <div className="title-separator"></div>
        </div>

        {/* The Steps Wrapper */}
        <div className="steps-wrapper">
          {/* The Connecting Line (Background) */}
          <div className="process-line-container">
            <div className="process-line"></div>
          </div>

          <div className="steps-grid">
            {steps.map((step, index) => (
              <div key={step.id} className="step-card fade-up" style={{ animationDelay: `${index * 0.2}s` }}>
                
                {/* Icon Circle */}
                <div className="icon-wrapper">
                  <div className="icon-circle">
                    {step.icon}
                  </div>
                  <div className="step-number">{step.id}</div>
                </div>

                {/* Text Content */}
                <div className="step-content">
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-desc">{step.desc}</p>
                </div>

              </div>
            ))}
          </div>
        </div>
{/* ⭐ Added Paragraph Section Here */}
      <div className="process-bottom-text fade-up">
        
        </div>
      </div>
    </section>
  );
};

export default ProcessFlow;
 