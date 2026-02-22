import React from 'react';
import './SuccessStories.css';

const stories = [
  {
    id: 1,
    names: "Ananya & Rahul",
    image: "/banner1.png",
    story: "We found each other through the 'Interest' filter. Within three months, our families met and the rest is history!",
    date: "Married Oct 2025"
  },
  {
    id: 2,
    names: "Sarah & David",
    image: "/example.jpg",
    story: "I was skeptical about online matrimony, but David's verified profile and shared values made all the difference.",
    date: "Married Dec 2025"
  },
  {
    id: 3,
    names: "Priya & Vikram",
    image: "/example1.jpg",
    story: "Distance was a hurdle until we met here. The platform made it easy to communicate and build trust.",
    date: "Married Jan 2026"
  }
];

const SuccessStories = () => {
  return (
    <section className="stories-section">
      <div className="stories-container">
        <div className="stories-header">
          <div className="header-text">
            <h2 className="stories-title">Real Weddings, Real Love</h2>
            <p className="stories-description">
              Every match is a milestone. Read how these couples found their forever.
            </p>
          </div>
          <button className="view-all-btn">View All Stories →</button>
        </div>

        <div className="stories-grid">
          {stories.map((story) => (
            <div key={story.id} className="story-card">
              <div className="image-wrapper">
                <img 
                  src={story.image} 
                  alt={story.names} 
                  className="story-image"
                />
                <span className="story-badge">{story.date}</span>
              </div>
              <h3 className="couple-names">{story.names}</h3>
              <p className="story-text">"{story.story}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;