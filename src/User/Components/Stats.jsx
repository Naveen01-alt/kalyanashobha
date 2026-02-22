import React from 'react';
import './Stats.css';

const stats = [
  { id: 1, label: 'Happy Couples', value: '10,000+' },
  { id: 2, label: 'Active Profiles', value: '150K' },
  { id: 3, label: 'Daily Matches', value: '500+' },
  { id: 4, label: 'Success Rate', value: '98%' },
];

const Stats = () => {
  return (
    <section className="stats-section">
      <div className="stats-container">
        <div className="stats-header">
          <h2 className="stats-title">Our Success in Numbers</h2>
          <p className="stats-subtitle">Connecting hearts across the globe since 2015.</p>
        </div>
        
        <div className="stats-grid">
          {stats.map((stat) => (
            <div key={stat.id} className="stats-card">
              <p className="stat-value">{stat.value}</p>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;