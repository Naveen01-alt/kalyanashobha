import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { 
  Search, Filter, Trash2, Ban, CheckCircle, 
  User, X, ChevronLeft, ChevronRight,
  Briefcase, MapPin, Image, Shield
} from 'lucide-react';
import './UserManagement.css'; 

const API_BASE_URL = "https://kalyanashobha-back.vercel.app/api";

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [processingId, setProcessingId] = useState(null); 
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [referralFilter, setReferralFilter] = useState("all");

  const [advFilters, setAdvFilters] = useState({
      memberId: '', gender: '', maritalStatus: '',
      minAge: '', maxAge: '', religion: '', caste: '', 
      subCommunity: '', education: '', occupation: '',
      country: '', state: '', city: ''
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_BASE_URL}/admin/users/advanced`, {
        headers: { Authorization: token },
        params: {
          search: searchTerm,
          referralType: referralFilter === 'all' ? '' : referralFilter,
          page: page,
          limit: 6 // --- CHANGED TO 6 USERS PER PAGE ---
        }
      });

      if (response.data.success) {
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!showAdvanced) {
        const timer = setTimeout(() => fetchUsers(), 500);
        return () => clearTimeout(timer);
    }
  }, [searchTerm, referralFilter, page, showAdvanced]);

  const handleAdvChange = (e) => {
    setAdvFilters({ ...advFilters, [e.target.name]: e.target.value });
  };

  const executeAdvancedSearch = async (e) => {
    if(e) e.preventDefault();
    setLoading(true); 
    const toastId = toast.loading("Searching..."); 

    try {
        const token = localStorage.getItem('adminToken');
        const response = await axios.post(
            `${API_BASE_URL}/admin/users/search-advanced`, 
            advFilters,
            { headers: { Authorization: token } }
        );
        if (response.data.success) {
            setUsers(response.data.users);
            setTotalPages(1); 
            toast.update(toastId, { render: "Search completed", type: "success", isLoading: false, autoClose: 2000 });
        }
    } catch (error) {
        toast.update(toastId, { render: "Search failed", type: "error", isLoading: false, autoClose: 3000 });
    } finally {
        setLoading(false);
    }
  };

  const clearAdvanced = () => {
    setAdvFilters({
      memberId: '', gender: '', maritalStatus: '', minAge: '', maxAge: '', 
      religion: '', caste: '', subCommunity: '', education: '', occupation: '',
      country: '', state: '', city: ''
    });
    setShowAdvanced(false); 
    setPage(1);
  };

  const handleDelete = async (userId) => {
    if(!window.confirm("Permanently delete this user? This cannot be undone.")) return;
    
    setProcessingId(userId);
    const toastId = toast.loading("Deleting user...");

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API_BASE_URL}/admin/users/${userId}`, { 
        headers: { Authorization: token } 
      });
      
      toast.update(toastId, { render: "User deleted successfully", type: "success", isLoading: false, autoClose: 3000 });
      
      // Refresh list
      showAdvanced ? executeAdvancedSearch() : fetchUsers();
    } catch (error) { 
      toast.update(toastId, { render: "Delete failed", type: "error", isLoading: false, autoClose: 3000 });
    } finally {
      setProcessingId(null);
    }
  };

  const handleBlockToggle = async (userId, isActive) => {
    const action = isActive ? 'BLOCK' : 'UNBLOCK';
    if(!window.confirm(`Are you sure you want to ${action} this user?`)) return;

    setProcessingId(userId);
    const toastId = toast.loading(`Processing ${action.toLowerCase()}...`);

    try {
      const token = localStorage.getItem('adminToken');
      const shouldRestrict = isActive; 

      const response = await axios.post(`${API_BASE_URL}/admin/users/restrict`, 
        { userId, restrict: shouldRestrict },
        { headers: { Authorization: token } }
      );

      if (response.data.success) {
         toast.update(toastId, { render: `User ${action.toLowerCase()}ed successfully`, type: "success", isLoading: false, autoClose: 3000 });
         showAdvanced ? executeAdvancedSearch() : fetchUsers();
      }

    } catch (error) {
      toast.update(toastId, { render: "Action failed", type: "error", isLoading: false, autoClose: 3000 });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" theme="colored" />
      
      <div className="um-layout">
        <header className="um-header">
          <div className="um-header-content">
            <h1 className="um-title">User Registry</h1>
            <p className="um-subtitle">Comprehensive database of registered profiles.</p>
          </div>
          <button 
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`um-action-btn ${showAdvanced ? 'active' : ''}`}
          >
            {showAdvanced ? <><X size={16} /> Close Filter</> : <><Filter size={16} /> Advanced Filter</>}
          </button>
        </header>

        <div className="um-controls">
          {showAdvanced ? (
            <form onSubmit={executeAdvancedSearch} className="um-adv-form">
              <div className="um-form-grid">
                <input name="memberId" value={advFilters.memberId} onChange={handleAdvChange} placeholder="Member ID" className="um-input" />
                <select name="gender" value={advFilters.gender} onChange={handleAdvChange} className="um-input">
                    <option value="">Gender (Any)</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
                <select name="maritalStatus" value={advFilters.maritalStatus} onChange={handleAdvChange} className="um-input">
                    <option value="">Marital Status (Any)</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                </select>
                <div className="um-range-group">
                  <input type="number" name="minAge" placeholder="Min Age" value={advFilters.minAge} onChange={handleAdvChange} className="um-input" />
                  <span className="um-divider">-</span>
                  <input type="number" name="maxAge" placeholder="Max Age" value={advFilters.maxAge} onChange={handleAdvChange} className="um-input" />
                </div>
                {/* Cultural */}
                <input name="religion" value={advFilters.religion} onChange={handleAdvChange} placeholder="Religion" className="um-input" />
                <input name="caste" value={advFilters.caste} onChange={handleAdvChange} placeholder="Caste" className="um-input" />
                <input name="subCommunity" value={advFilters.subCommunity} onChange={handleAdvChange} placeholder="Sub Community" className="um-input" />
                {/* Professional */}
                <input name="education" value={advFilters.education} onChange={handleAdvChange} placeholder="Education" className="um-input" />
                <input name="occupation" value={advFilters.occupation} onChange={handleAdvChange} placeholder="Occupation" className="um-input" />
                {/* Location */}
                <input name="city" value={advFilters.city} onChange={handleAdvChange} placeholder="City" className="um-input" />
                <input name="state" value={advFilters.state} onChange={handleAdvChange} placeholder="State" className="um-input" />
                <input name="country" value={advFilters.country} onChange={handleAdvChange} placeholder="Country" className="um-input" />
              </div>
              <div className="um-form-actions">
                <button type="button" onClick={clearAdvanced} className="um-text-btn">Reset</button>
                <button type="submit" className="um-primary-btn" disabled={loading}>{loading ? 'Searching...' : 'Apply Filters'}</button>
              </div>
            </form>
          ) : (
            <div className="um-quick-bar">
              <div className="um-search-wrapper">
                <Search className="um-search-icon" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by ID, Name, Phone..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="um-search-input"
                />
              </div>
              <div className="um-filters">
                <select value={referralFilter} onChange={(e) => setReferralFilter(e.target.value)} className="um-select">
                  <option value="all">Source: All</option>
                  <option value="self">Self (Direct)</option>
                  <option value="agent">Agent Referred</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="um-loading"><div className="um-spinner"></div><span>Loading data...</span></div>
        ) : (
          <>
            <div className="um-grid">
              {users.length > 0 ? (
                  users.map(user => (
                      <UserBlock 
                          key={user._id} 
                          user={user} 
                          isProcessing={processingId === user._id}
                          onView={() => setSelectedUser(user)}
                          onBlock={() => handleBlockToggle(user._id, user.isActive)}
                          onDelete={() => handleDelete(user._id)}
                      />
                  ))
              ) : (
                  <div className="um-empty">No records found matching criteria.</div>
              )}
            </div>

            {!showAdvanced && users.length > 0 && (
                <div className="um-pagination">
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="um-page-btn"><ChevronLeft size={16} /></button>
                    <span className="um-page-info">Page {page} of {totalPages}</span>
                    <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="um-page-btn"><ChevronRight size={16} /></button>
                </div>
            )}
          </>
        )}

        {selectedUser && <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
      </div>
    </>
  );
};

// --- COMPONENT: USER BLOCK (Populated Agent Info) ---
const UserBlock = ({ user, isProcessing, onView, onBlock, onDelete }) => {
  const getAge = (dob) => dob ? Math.abs(new Date(Date.now() - new Date(dob).getTime()).getUTCFullYear() - 1970) : "N/A";
  
  // Logic to determine if Referred
  const hasAgent = user.referredByAgentId && typeof user.referredByAgentId === 'object';
  
  const agentName = hasAgent ? user.referredByAgentId.name : (user.referredByAgentName || "Unknown");
  const agentCode = hasAgent ? user.referredByAgentId.agentCode : "Manual Ref";

  return (
    <div className={`user-card ${!user.isActive ? 'restricted-user' : ''}`}>
      <div className="uc-header">
        <span className="uc-id">{user.uniqueId || "N/A"}</span>
        {!user.isActive && <span className="uc-badge-restricted">RESTRICTED</span>}
      </div>
      
      <div className="uc-body">
        <div className="uc-avatar-wrap">
          {user.photos?.[0] ? 
            <img src={user.photos[0]} alt="Profile" className="uc-avatar" /> : 
            <div className="uc-avatar-placeholder"><User size={24} /></div>
          }
        </div>
        <div className="uc-details">
          <h3 className="uc-name">{user.firstName} {user.lastName}</h3>
          <div className="uc-meta-row">
            <span>{getAge(user.dob)} Yrs</span><span className="uc-dot">•</span><span>{user.gender}</span>
          </div>
          <p className="uc-location">{user.city}, {user.state}</p>
          
          {(hasAgent || user.referralType === 'manual') && (
            <div className="uc-agent-tag">
              <Shield size={12} />
              <span style={{ fontSize: '11px' }}>
                Agent: <b>{agentName}</b> ({agentCode})
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="uc-actions">
        <button onClick={onView} className="uc-btn-view" disabled={isProcessing}>View Profile</button>
        <div className="uc-icon-group">
          <button 
            onClick={onBlock} 
            className={`uc-icon-btn ${!user.isActive ? 'is-blocked' : ''}`} 
            disabled={isProcessing}
            title={user.isActive ? "Restrict User" : "Unblock User"}
          >
            {isProcessing ? <span className="loader-text">...</span> : (user.isActive ? <Ban size={16} /> : <CheckCircle size={16} />)}
          </button>
          <button onClick={onDelete} className="uc-icon-btn delete" disabled={isProcessing}>
             {isProcessing ? <span className="loader-text">...</span> : <Trash2 size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT: DETAIL MODAL ---
const UserDetailModal = ({ user, onClose }) => {
  const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-IN', {day: 'numeric', month: 'short', year: 'numeric'}) : "-";
  
  const hasAgent = user.referredByAgentId && typeof user.referredByAgentId === 'object';
  const agentName = hasAgent ? user.referredByAgentId.name : user.referredByAgentName;
  const agentCode = hasAgent ? user.referredByAgentId.agentCode : "Manual";

  return (
    <div className="um-modal-overlay">
      <div className="um-modal-container">
        <div className="um-modal-header">
          <div className="um-modal-title-group">
            <h2 className="um-modal-name">{user.firstName} {user.lastName}</h2>
            <span className="um-modal-id-badge">{user.uniqueId}</span>
          </div>
          <button onClick={onClose} className="um-close-btn"><X size={24} /></button>
        </div>

        <div className="um-modal-body">
          <div className="um-modal-top-bar">
             <div className="um-top-chips">
                <span className="um-chip">{user.gender}</span>
                <span className="um-chip">{formatDate(user.dob)}</span>
                
                {(hasAgent || user.referralType === 'manual') && (
                  <span className="um-chip agent">
                    Referred by: <strong>{agentName}</strong> (ID: {agentCode})
                  </span>
                )}
             </div>
          </div>

          {user.photos && user.photos.length > 0 ? (
            <div className="um-gallery-section">
              <h4 className="um-label-small"><Image size={14} /> Profile Photos</h4>
              <div className="um-photo-grid">
                {user.photos.map((src, i) => (
                  <div key={i} className="um-photo-card"><img src={src} alt={`User ${i}`} /></div>
                ))}
              </div>
            </div>
          ) : (<div className="um-no-photos">No profile photos available.</div>)}

          <div className="um-details-layout">
            <div className="um-detail-column">
              <h3 className="um-column-title"><User size={16} /> Personal & Cultural</h3>
              <div className="um-data-table">
                <DataRow label="Marital Status" value={user.maritalStatus} />
                <DataRow label="Height" value={`${user.height} cm`} />
                <DataRow label="Diet" value={user.diet} />
                <div className="um-spacer"></div>
                <DataRow label="Religion" value={user.religion} />
                <DataRow label="Community" value={user.community} />
                <DataRow label="Sub-Community" value={user.subCommunity} />
                <DataRow label="Caste" value={user.caste} />
              </div>
            </div>
            <div className="um-detail-column">
              <h3 className="um-column-title"><Briefcase size={16} /> Professional & Location</h3>
              <div className="um-data-table">
                <DataRow label="Education" value={user.highestQualification} />
                <DataRow label="College" value={user.collegeName} />
                <DataRow label="Occupation" value={user.jobRole} />
                <DataRow label="Company" value={user.companyName} />
                <DataRow label="Work Type" value={user.workType} />
                <DataRow label="Annual Income" value={user.annualIncome} />
                <div className="um-spacer"></div>
                <DataRow label="City" value={user.city} />
                <DataRow label="State" value={user.state} />
                <DataRow label="Country" value={user.country} />
              </div>
            </div>
            <div className="um-detail-column highlight">
              <h3 className="um-column-title"><MapPin size={16} /> Contact Information</h3>
              <div className="um-contact-box">
                <div className="um-contact-item"><span className="label">Mobile Number</span><span className="value">{user.mobileNumber}</span></div>
                <div className="um-contact-item"><span className="label">Email Address</span><span className="value">{user.email}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DataRow = ({ label, value }) => (
  <div className="um-row"><span className="um-lbl">{label}</span><span className="um-val">{value || "-"}</span></div>
);

export default AdminUserManagement;
