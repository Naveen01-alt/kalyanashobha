import React, { useState, useEffect } from "react";
import axios from "axios";
import { Users, UserPlus, Trash2, Eye, X, Phone, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./AgentManagement.css";

export default function AgentManagement() {
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // --- NEW: Pagination State for Modal ---
  const [detailPage, setDetailPage] = useState(1);
  const USERS_PER_PAGE = 5; 

  // Data States
  const [selectedAgent, setSelectedAgent] = useState(null); 
  const [formData, setFormData] = useState({ name: "", email: "", mobile: "", password: "" });

  // 1. Fetch All Agents
  const fetchAgents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get("https://kalyanashobha-back.vercel.app/api/admin/agents", {
        headers: { Authorization: token },
      });
      if (res.data.success) {
        setAgents(res.data.agents);
        setFilteredAgents(res.data.agents);
      }
    } catch (err) {
      toast.error("Failed to load agents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  // 2. Search Logic
  useEffect(() => {
    if (!searchTerm) {
      setFilteredAgents(agents);
    } else {
      const lowerTerm = searchTerm.toLowerCase();
      const filtered = agents.filter(agent => 
        agent.name.toLowerCase().includes(lowerTerm) ||
        agent.agentCode?.toLowerCase().includes(lowerTerm) ||
        agent.mobile.includes(lowerTerm)
      );
      setFilteredAgents(filtered);
    }
  }, [searchTerm, agents]);

  // 3. Add Agent
  const handleCreateAgent = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Creating agent...");
    try {
      const token = localStorage.getItem("adminToken");
      await axios.post("https://kalyanashobha-back.vercel.app/api/admin/agents", formData, {
        headers: { Authorization: token },
      });
      toast.update(toastId, { render: "Agent Created Successfully", type: "success", isLoading: false, autoClose: 3000 });
      setShowAddModal(false);
      setFormData({ name: "", email: "", mobile: "", password: "" });
      fetchAgents();
    } catch (err) {
      toast.update(toastId, { render: "Error creating agent", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  // 4. View Details
  const handleViewDetails = async (agentId) => {
    const toastId = toast.loading("Fetching details...");
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(`https://kalyanashobha-back.vercel.app/api/admin/agents/${agentId}/details`, {
        headers: { Authorization: token },
      });
      if (res.data.success) {
        toast.dismiss(toastId);
        setSelectedAgent(res.data);
        
        // --- NEW: Reset page to 1 when opening modal ---
        setDetailPage(1); 
        
        setShowDetailModal(true);
      }
    } catch (err) {
      toast.update(toastId, { render: "Could not fetch details", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  // 5. Delete Agent
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure? This action cannot be undone.")) return;
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`https://kalyanashobha-back.vercel.app/api/admin/agents/${id}`, {
        headers: { Authorization: token },
      });
      toast.success("Agent deleted successfully");
      fetchAgents();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // --- NEW: Helper to get users for current page ---
  const getPaginatedUsers = () => {
    if (!selectedAgent || !selectedAgent.users) return [];
    const indexOfLast = detailPage * USERS_PER_PAGE;
    const indexOfFirst = indexOfLast - USERS_PER_PAGE;
    return selectedAgent.users.slice(indexOfFirst, indexOfLast);
  };

  const totalDetailPages = selectedAgent?.users 
    ? Math.ceil(selectedAgent.users.length / USERS_PER_PAGE) 
    : 0;

  return (
    <div className="am-container">
      <ToastContainer position="top-right" theme="colored" />
      
      <div className="am-header">
        <div className="am-title-section">
          <h2>Agent Management</h2>
          <p>Manage affiliates and track referrals.</p>
        </div>
        <button className="am-btn-primary" onClick={() => setShowAddModal(true)}>
          <UserPlus size={18} /> Add New Agent
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="am-search-bar">
        <Search className="search-icon" size={18} />
        <input 
          type="text" 
          placeholder="Search by Name, Agent ID, or Mobile..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* AGENT LIST */}
      <div className="am-grid">
        {loading ? (
          <div className="am-loading">Loading agents...</div>
        ) : filteredAgents.length === 0 ? (
          <div className="am-no-data">No agents found matching your search.</div>
        ) : (
          filteredAgents.map((agent) => (
            <div key={agent._id} className="am-card">
              <div className="am-card-top">
                <div className="am-avatar">{agent.name.charAt(0).toUpperCase()}</div>
                <div className="am-info">
                  <h3>{agent.name}</h3>
                  <span className="am-code-badge">{agent.agentCode || "PENDING"}</span>
                </div>
              </div>
              
              <div className="am-card-stats">
                <div className="am-stat-row">
                    <Users size={14} className="icon-gold" />
                    <span>{agent.referralCount || 0} Referrals</span>
                </div>
                <div className="am-stat-row">
                    <Phone size={14} className="icon-gold" />
                    <span>{agent.mobile}</span>
                </div>
              </div>

              <div className="am-card-actions">
                <button className="am-btn-view" onClick={() => handleViewDetails(agent._id)}>
                  <Eye size={16} /> View Referrals
                </button>
                <button className="am-btn-del" onClick={() => handleDelete(agent._id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL: ADD AGENT */}
      {showAddModal && (
        <div className="am-modal-overlay">
          <div className="am-modal-content">
            <div className="am-modal-header">
              <h3>Register New Agent</h3>
              <button onClick={() => setShowAddModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateAgent} className="am-form">
              <div className="am-input-group">
                <label>Full Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Enter full name" />
              </div>
              <div className="am-input-group">
                <label>Mobile Number</label>
                <input type="text" required value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} placeholder="10-digit mobile" />
              </div>
              <div className="am-input-group">
                <label>Email Address</label>
                <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="agent@example.com" />
              </div>
              <div className="am-input-group">
                <label>Create Password</label>
                <input type="text" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="Secure password" />
              </div>
              <button type="submit" className="am-submit-btn">Create Account</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AGENT DETAILS & USERS */}
      {showDetailModal && selectedAgent && (
        <div className="am-modal-overlay">
          <div className="am-modal-content large">
            <div className="am-modal-header">
              <div className="header-left">
                <h3>{selectedAgent.agent.name}</h3>
                <span className="am-code-badge large">{selectedAgent.agent.agentCode}</span>
              </div>
              <button onClick={() => setShowDetailModal(false)}><X size={20} /></button>
            </div>

            <div className="am-referral-list">
              <div className="am-list-header">
                <h4>Referred Users</h4>
                <span className="am-count-badge">{selectedAgent.users.length} Total</span>
              </div>

              {selectedAgent.users.length === 0 ? (
                <div className="am-no-data-small">No users referred yet.</div>
              ) : (
                <>
                  <div className="am-table-wrapper">
                    <table className="am-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>User ID</th>
                          <th>Mobile</th>
                          <th>Membership</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* --- USE PAGINATED DATA HERE --- */}
                        {getPaginatedUsers().map(u => (
                          <tr key={u._id}>
                            <td className="fw-500">{u.firstName} {u.lastName}</td>
                            <td className="text-muted">{u.uniqueId}</td>
                            <td>{u.mobileNumber}</td>
                            <td>
                              {u.isPaidMember ? (
                                <span className="am-tag paid">Paid Member</span>
                              ) : (
                                <span className="am-tag free">Free</span>
                              )}
                            </td>
                            <td className="text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* --- PAGINATION CONTROLS --- */}
                  {selectedAgent.users.length > USERS_PER_PAGE && (
                    <div className="am-pagination-controls">
                      <button 
                        className="am-page-btn" 
                        disabled={detailPage === 1} 
                        onClick={() => setDetailPage(p => p - 1)}
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <span className="am-page-info">
                        Page {detailPage} of {totalDetailPages}
                      </span>
                      <button 
                        className="am-page-btn" 
                        disabled={detailPage === totalDetailPages} 
                        onClick={() => setDetailPage(p => p + 1)}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
