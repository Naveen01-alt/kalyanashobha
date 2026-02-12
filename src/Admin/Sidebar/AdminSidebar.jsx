import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
// Added Briefcase (Agents) and Store (Vendors) icons
import { LayoutDashboard, Users, Heart, LogOut, CheckCircle, Briefcase, Store } from "lucide-react";
import axios from "axios";
import "./AdminSidebar.css";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation(); 
  
  // State for both badges
  const [stats, setStats] = useState({ 
    pendingReg: 0,
    pendingInterest: 0 
  });

  const fetchCounts = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return;
      
      const res = await axios.get("https://kalyanashobha-back.vercel.app/api/admin/stats", {
        headers: { Authorization: token }
      });
      
      if (res.data.success) {
        setStats({
          // Get Registration Pending Count
          pendingReg: res.data.stats.actionQueue.pendingRegistrationPayments,
          // Get Interest Pending Count
          pendingInterest: res.data.stats.actionQueue.pendingInterestPayments
        });
      }
    } catch (e) {
      console.error("Failed to fetch sidebar stats");
    }
  };

  useEffect(() => {
    fetchCounts();
    // Listen for updates from components
    window.addEventListener("paymentUpdated", fetchCounts);
    window.addEventListener("interestUpdated", fetchCounts);
    
    return () => {
        window.removeEventListener("paymentUpdated", fetchCounts);
        window.removeEventListener("interestUpdated", fetchCounts);
    }
  }, [location.pathname]); 

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    navigate('/admin/login');
  };

  return (
    <aside className="ks-sidebar-container">
      <div className="ks-sidebar-header">
        <h2 className="ks-sidebar-title">KalyanaShobha</h2>
        <span className="ks-sidebar-subtitle">Admin Portal</span>
      </div>

      <nav className="ks-sidebar-nav">
        <ul>
          <li>
            <NavLink to="/admin/dashboard" className={({ isActive }) => (isActive ? "ks-nav-link active" : "ks-nav-link")}>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink to="/admin/users" className={({ isActive }) => (isActive ? "ks-nav-link active" : "ks-nav-link")}>
              <Users size={20} />
              <span>User Registry</span>
            </NavLink>
          </li>

          {/* Registration Approvals Badge */}
          <li>
            <NavLink to="/admin/registration-approvals" className={({ isActive }) => (isActive ? "ks-nav-link active" : "ks-nav-link")}>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <CheckCircle size={20} />
                {stats.pendingReg > 0 && (
                  <span className="ks-notification-badge">{stats.pendingReg}</span>
                )}
              </div>
              <span>Reg. Approvals</span>
            </NavLink>
          </li>

           {/* Interest Approvals Badge */}
          <li>
            <NavLink to="/admin/interest-approvals" className={({ isActive }) => (isActive ? "ks-nav-link active" : "ks-nav-link")}>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Heart size={20} />
                {stats.pendingInterest > 0 && (
                  <span className="ks-notification-badge">{stats.pendingInterest}</span>
                )}
              </div>
              <span>Interest Approvals</span>
            </NavLink>
          </li>

          {/* NEW: Agents Route */}
          <li>
            <NavLink to="/admin/agents" className={({ isActive }) => (isActive ? "ks-nav-link active" : "ks-nav-link")}>
              <Briefcase size={20} />
              <span>Agents</span>
            </NavLink>
          </li>

          {/* NEW: Vendors Route */}
          <li>
            <NavLink to="/admin/vendors" className={({ isActive }) => (isActive ? "ks-nav-link active" : "ks-nav-link")}>
              <Store size={20} />
              <span>Vendors</span>
            </NavLink>
          </li>

        </ul>
      </nav>

      <div className="ks-sidebar-footer">
        <button onClick={handleLogout} className="ks-logout-btn">
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
