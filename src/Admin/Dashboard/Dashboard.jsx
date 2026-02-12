import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; 

import { 
  Users, UserCheck, UserX, 
  CheckCircle, Heart, Briefcase, Share2 
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_BASE = "https://kalyanashobha-back.vercel.app/api/admin";

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/stats`, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token 
        }
      });
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      } else {
        setError('Failed to load stats');
      }
    } catch (err) {
      setError('System Unavailable');
    } finally {
      setLoading(false);
    }
  };

  // Metric Card Component
  const MetricCard = ({ label, value, icon: Icon, trend, iconColor, iconBg }) => (
    <div className="metric-card">
      <div className="metric-header-row">
        <div 
          className="metric-icon-wrapper" 
          style={{ color: iconColor, backgroundColor: iconBg }}
        >
          {Icon && <Icon size={20} strokeWidth={1.5} />}
        </div>
        
        {trend && <span className="metric-trend positive">↑</span>}
      </div>
      
      <div className="metric-content">
        <div className="metric-value">
          {value !== undefined ? value.toLocaleString() : '-'}
        </div>
        <span className="metric-label">{label}</span>
      </div>
    </div>
  );

  if (loading) return (
    <div className="dash-loading-screen">
      <div className="spinner-ring"></div>
      <span className="loading-caption">AUTHENTICATING SECURE CONNECTION...</span>
    </div>
  );

  return (
    <>
      <div className="admin-layout1">
        
        {/* Header */}
        <header className="page-header">
          <div className="header-text">
            <h1 className="page-title">Executive Overview</h1>
            <p className="page-subtitle">Real-time platform analytics & health monitoring.</p>
          </div>
          <div className="header-actions">
            <div className="status-indicator">
              <span className="dot"></span> System Operational
            </div>
            <div className="date-badge">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
            </div>
          </div>
        </header>

        {error && <div className="system-alert">{error}</div>}

        {stats && (
          <div className="dashboard-grid">
            
            {/* SECTION: USER BASE (Blue/Purple Theme) */}
            <section className="dash-section">
              <div className="section-header">
                <h3>User Demographics</h3>
                <div className="line"></div>
              </div>
              <div className="metrics-row four-up">
                <MetricCard 
                  label="Total Registered Users" 
                  value={stats.users?.total} 
                  icon={Users} 
                  trend={true}
                  iconColor="#2563EB" // Blue
                  iconBg="#EFF6FF"
                />
                <MetricCard 
                  label="Male Profiles" 
                  value={stats.users?.males} 
                  icon={UserCheck} 
                  iconColor="#0EA5E9" // Sky Blue
                  iconBg="#E0F2FE"
                />
                <MetricCard 
                  label="Female Profiles" 
                  value={stats.users?.females} 
                  icon={UserCheck} 
                  iconColor="#EC4899" // Pink
                  iconBg="#FDF2F8"
                />
                <MetricCard 
                  label="Restricted Accounts" 
                  value={stats.users?.blocked} 
                  icon={UserX} 
                  iconColor="#DC2626" // Red
                  iconBg="#FEF2F2"
                />
              </div>
            </section>

            {/* SECTION: PLATFORM HEALTH (Gold/Teal Theme) */}
            <section className="dash-section">
              <div className="section-header">
                <h3>Platform Health & Growth</h3>
                <div className="line"></div>
              </div>
              <div className="metrics-row four-up">
                <MetricCard 
                  label="Total Interests Sent" 
                  value={stats.platformHealth?.totalInterestsSent} 
                  icon={Heart} 
                  iconColor="#E11D48" // Rose
                  iconBg="#FFE4E6"
                />
                <MetricCard 
                  label="Successful Matches" 
                  value={stats.platformHealth?.successfulMatches} 
                  icon={CheckCircle} 
                  trend={true} 
                  iconColor="#C5A059" // Brand Gold
                  iconBg="rgba(197, 160, 89, 0.1)"
                />
                <MetricCard 
                  label="Active Agents" 
                  value={stats.referrals?.totalAgents} 
                  icon={Briefcase} 
                  iconColor="#0891B2" // Cyan
                  iconBg="#CFFAFE"
                />
                <MetricCard 
                  label="User Referrals" 
                  value={stats.referrals?.totalReferredUsers} 
                  icon={Share2} 
                  iconColor="#4F46E5" // Indigo
                  iconBg="#E0E7FF"
                />
              </div>
            </section>

          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
