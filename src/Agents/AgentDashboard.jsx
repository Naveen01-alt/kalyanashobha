import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, CreditCard, Heart, LogOut, Link as LinkIcon, 
  Plus, X, Clock, ChevronRight, Activity, Loader2 
} from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import './AgentPortal.css'; 

const API_BASE = "https://kalyanashobha-back.vercel.app/api/agent";

// --- CONSTANTS FOR DROPDOWNS ---
const CASTE_OPTIONS = [
  "Brahmin", "Reddy", "Kamma", "Kapu", "Vysya", "Raju", 
  "Balija", "Goud", "Mudiraj", "Yadav", "Mala", "Madiga", 
  "Padmashali", "Nayi Brahmin", "Velama", "Kummari", "Vaddera",
  "SC", "ST", "BC-A", "BC-B", "BC-C", "BC-D", "BC-E",
  "OC", "Other"
];

const COMMUNITY_OPTIONS = [
  "Telugu", "Hindi", "Tamil", "Kannada", "Malayalam", "Marathi", "Other"
];

const EDU_OPTIONS = [
  "B.Tech", "M.Tech", "MBA", "MCA", "MBBS", "MD", "B.Com", 
  "M.Com", "B.Sc", "M.Sc", "B.A", "M.A", "Ph.D", "Diploma", 
  "Inter/12th", "SSC/10th", "Other"
];

// Reusable Loading Component
const TabLoader = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 0', color: '#64748b' }}>
    <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', marginBottom: '12px', color: '#c0392b' }} />
    <p>processing ...</p>
    <style>
      {`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}
    </style>
  </div>
);

const AgentDashboard = () => {
  const navigate = useNavigate();
  
  // 1. Initial State from LocalStorage
  const [token, setToken] = useState(localStorage.getItem('agentToken'));
  const [agentInfo, setAgentInfo] = useState(JSON.parse(localStorage.getItem('agentInfo') || 'null'));
  
  const [activeTab, setActiveTab] = useState('overview'); 
  const [stats, setStats] = useState({ totalReferrals: 0, paidReferrals: 0, pendingApprovals: 0 });
  const [usersList, setUsersList] = useState([]);
  const [memPayments, setMemPayments] = useState([]);
  const [intPayments, setIntPayments] = useState([]);
  const [interestsStatus, setInterestsStatus] = useState([]); 
  const [dashboardLoading, setDashboardLoading] = useState(false);

  // UI States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showImageModal, setShowImageModal] = useState(null); 
  const [regLoading, setRegLoading] = useState(false);

  // Registration Data State
  const [regData, setRegData] = useState({
    profileFor: 'Myself', firstName: '', lastName: '', gender: 'Male', dob: '', 
    maritalStatus: 'Never Married', height: '', diet: 'Veg',
    religion: 'Hindu', community: 'Telugu', caste: '', subCommunity: '', 
    country: 'India', state: 'Telangana', city: '', 
    highestQualification: '', collegeName: '', workType: 'Private', 
    jobRole: '', companyName: '', annualIncome: '',
    mobileNumber: '', email: '', password: ''
  });

  // 2. CHECK AUTH & FETCH DATA
  useEffect(() => {
    if (!token) {
      navigate('/agent/login', { replace: true });
      return;
    }
    if (token) {
      fetchAllData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, navigate]);

  const fetchAllData = async () => {
    setDashboardLoading(true);
    try {
      const headers = { Authorization: token };
      const [sRes, uRes, mpRes, ipRes, isRes] = await Promise.all([
        fetch(`${API_BASE}/dashboard/stats`, { headers }),
        fetch(`${API_BASE}/users`, { headers }), 
        fetch(`${API_BASE}/payments/registrations`, { headers }),
        fetch(`${API_BASE}/payments/interests`, { headers }),
        fetch(`${API_BASE}/users/interests`, { headers }) 
      ]);

      const sData = await sRes.json();
      const uData = await uRes.json();
      const mpData = await mpRes.json();
      const ipData = await ipRes.json();
      const isData = await isRes.json();

      if(sData.success) setStats(sData.stats);
      if(uData.success) setUsersList(uData.users);
      if(mpData.success) setMemPayments(mpData.payments);
      if(ipData.success) setIntPayments(ipData.payments);
      if(isData.success) setInterestsStatus(isData.data);

    } catch (error) {
      console.error("Fetch Error", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setDashboardLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('agentToken');
    localStorage.removeItem('agentInfo');
    navigate('/agent/login', { replace: true });
  };

  const copyLink = () => {
    const link = `${window.location.origin}/registration?refId=${agentInfo?.id || agentInfo?._id}&refName=${encodeURIComponent(agentInfo?.name)}`;
    navigator.clipboard.writeText(link);
    toast.success("Referral Link Copied!"); 
  };

  const renderStatusBadge = (status, isBoolean = false) => {
    if (isBoolean) {
      return status ? <span className="ks-badge ks-badge-success">Active/Paid</span> : <span className="ks-badge ks-badge-pending">Pending</span>;
    }
    const s = status?.toLowerCase() || '';
    if (s.includes('success') || s.includes('accepted')) return <span className="ks-badge ks-badge-success">{status}</span>;
    if (s.includes('reject') || s.includes('decline')) return <span className="ks-badge ks-badge-danger">{status}</span>;
    return <span className="ks-badge ks-badge-pending">{status || 'Pending'}</span>;
  };

  const handleRegChange = (e) => setRegData({ ...regData, [e.target.name]: e.target.value });
  
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegLoading(true);
    
    const toastId = toast.loading("Registering new client...");
    
    // NOTE: Copying 'caste' value to 'subCommunity' automatically
    const payload = {
      ...regData,
      subCommunity: regData.caste, 
      height: parseFloat(regData.height) || 0,
      referredByAgentId: agentInfo?.id || agentInfo?._id,
      referredByAgentName: agentInfo?.name,
      referralType: "manual"
    };

    try {
      const res = await fetch(`${API_BASE}/register-user`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (data.success) {
        toast.update(toastId, { render: "User Successfully Registered!", type: "success", isLoading: false, autoClose: 3000 });
        setIsDrawerOpen(false);
        // Reset form
        setRegData({ 
          profileFor: 'Myself', firstName: '', lastName: '', gender: 'Male', dob: '', 
          maritalStatus: 'Never Married', height: '', diet: 'Veg',
          religion: 'Hindu', community: 'Telugu', caste: '', subCommunity: '', 
          country: 'India', state: 'Telangana', city: '', 
          highestQualification: '', collegeName: '', workType: 'Private', 
          jobRole: '', companyName: '', annualIncome: '',
          mobileNumber: '', email: '', password: ''
        });
        fetchAllData(); 
      } else {
        toast.update(toastId, { render: data.message || "Registration Failed", type: "error", isLoading: false, autoClose: 3000 });
      }
    } catch (error) { 
        toast.update(toastId, { render: "Network Error", type: "error", isLoading: false, autoClose: 3000 });
    }
    finally { setRegLoading(false); }
  };

  if (!token) return null; 

  return (
    <div className="ks-crm-layout">
      <ToastContainer position="top-right" theme="colored" />
      
      {/* SIDEBAR */}
      <aside className="ks-crm-sidebar">
        <div className="ks-sidebar-brand">
          <div className="ks-brand-logo">K</div>
          <div className="ks-brand-text">
            <h2>KalyanaShobha</h2>
            <span>Agent Portal</span>
          </div>
        </div>

        <div className="ks-agent-identity">
          <div className="ks-agent-avatar">{agentInfo?.name?.charAt(0) || 'A'}</div>
          <div className="ks-agent-meta">
            <span className="ks-agent-name">{agentInfo?.name}</span>
            <span className="ks-agent-id">ID: {agentInfo?.agentCode || 'AGENT'}</span>
          </div>
        </div>

        <nav className="ks-sidebar-nav">
          <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>
            <Clock size={18} /> Overview
          </button>
          <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
            <Users size={18} /> Directory
          </button>
          <button className={activeTab === 'mem_payments' ? 'active' : ''} onClick={() => setActiveTab('mem_payments')}>
            <CreditCard size={18} /> Registration Payments
          </button>
          <button className={activeTab === 'int_payments' ? 'active' : ''} onClick={() => setActiveTab('int_payments')}>
            <Heart size={18} /> Interest Payments
          </button>
          <button className={activeTab === 'int_status' ? 'active' : ''} onClick={() => setActiveTab('int_status')}>
            <Activity size={18} /> Interest Status
          </button>
        </nav>

        <div className="ks-sidebar-footer">
          <button className="ks-logout-btn" onClick={handleLogout}>
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="ks-crm-main">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="ks-animate-fade">
            <header className="ks-page-header">
              <h1>Dashboard Overview</h1>
              <button className="ks-btn-outline" onClick={copyLink} disabled={dashboardLoading}>
                <LinkIcon size={16} /> Copy Invite Link
              </button>
            </header>

            {dashboardLoading ? <TabLoader /> : (
              <div className="ks-metric-grid">
                 <div className="ks-metric-card">
                    <span className="ks-metric-label">Total Referrals</span>
                    <span className="ks-metric-val">{stats.totalReferrals}</span>
                 </div>
                 <div className="ks-metric-card">
                    <span className="ks-metric-label">Paid Conversions</span>
                    <span className="ks-metric-val text-gold">{stats.paidReferrals}</span>
                 </div>
                 <div className="ks-metric-card">
                    <span className="ks-metric-label">Pending Action</span>
                    <span className="ks-metric-val text-danger">{stats.pendingApprovals}</span>
                 </div>
              </div>
            )}
          </div>
        )}

        {/* USERS DIRECTORY TAB */}
        {activeTab === 'users' && (
          <div className="ks-animate-fade h-full flex-col">
            <header className="ks-page-header">
               <h1>Client Directory</h1>
               <button className="ks-btn-primary" onClick={() => setIsDrawerOpen(true)} disabled={dashboardLoading}>
                 <Plus size={16} /> Register Client
               </button>
            </header>
            
            {dashboardLoading ? <TabLoader /> : (
              <div className="ks-data-table-wrapper">
                <table className="ks-data-table">
                  <thead><tr><th>Client Profile</th><th>Contact Info</th><th>Status</th><th>Registration Date</th></tr></thead>
                  <tbody>
                    {usersList.length === 0 && <tr><td colSpan="4" className="ks-text-center py-8">No clients registered yet.</td></tr>}
                    {usersList.map(u => (
                      <tr key={u._id}>
                        <td>
                          <div className="ks-cell-primary">{u.firstName} {u.lastName}</div>
                          <div className="ks-cell-secondary">ID: {u.uniqueId}</div>
                        </td>
                        <td>
                          <div className="ks-cell-primary">{u.mobileNumber}</div>
                          <div className="ks-cell-secondary">{u.email}</div>
                        </td>
                        <td>{renderStatusBadge(u.isPaidMember, true)}</td>
                        <td className="ks-cell-secondary">{new Date(u.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric'})}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* MEMBERSHIP PAYMENTS */}
        {activeTab === 'mem_payments' && (
          <div className="ks-animate-fade">
            <header className="ks-page-header"><h1>Membership Transactions</h1></header>
            
            {dashboardLoading ? <TabLoader /> : (
              <div className="ks-data-table-wrapper">
                <table className="ks-data-table">
                  <thead><tr><th>Client</th><th>Amount</th><th>Reference (UTR)</th><th>Receipt</th><th>Status</th></tr></thead>
                  <tbody>
                    {memPayments.length === 0 && <tr><td colSpan="5" className="ks-text-center py-8">No transactions found.</td></tr>}
                    {memPayments.map(p => (
                      <tr key={p._id}>
                        <td className="ks-cell-primary">{p.userId?.firstName} {p.userId?.lastName}</td>
                        <td className="ks-cell-primary">₹{p.amount?.toLocaleString()}</td>
                        <td className="ks-font-mono">{p.utrNumber}</td>
                        <td><button className="ks-link-btn" onClick={() => setShowImageModal(p.screenshotUrl)}>View Proof</button></td>
                        <td>{renderStatusBadge(p.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* INTEREST PAYMENTS */}
        {activeTab === 'int_payments' && (
          <div className="ks-animate-fade">
            <header className="ks-page-header"><h1>Interest Requests (Payments)</h1></header>
            
            {dashboardLoading ? <TabLoader /> : (
              <div className="ks-data-table-wrapper">
                <table className="ks-data-table">
                  <thead><tr><th>Initiator</th><th>Target Profile</th><th>Amount</th><th>Receipt</th><th>Status</th></tr></thead>
                  <tbody>
                    {intPayments.length === 0 && <tr><td colSpan="5" className="ks-text-center py-8">No interest transactions found.</td></tr>}
                    {intPayments.map(p => (
                      <tr key={p._id}>
                        <td className="ks-cell-primary">{p.senderId?.firstName}</td>
                        <td className="ks-cell-primary">{p.receiverId?.firstName}</td>
                        <td className="ks-cell-primary">₹{p.amount?.toLocaleString()}</td>
                        <td><button className="ks-link-btn" onClick={() => setShowImageModal(p.screenshotUrl)}>View Proof</button></td>
                        <td>{renderStatusBadge(p.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* INTEREST STATUS TAB */}
        {activeTab === 'int_status' && (
          <div className="ks-animate-fade">
            <header className="ks-page-header"><h1>Client Interest Activity</h1></header>
            
            {dashboardLoading ? <TabLoader /> : (
              <div className="ks-data-table-wrapper">
                <table className="ks-data-table">
                  <thead><tr><th>Direction</th><th>My Client</th><th>Match Profile</th><th>Date</th><th>Status</th></tr></thead>
                  <tbody>
                    {interestsStatus.length === 0 && <tr><td colSpan="5" className="ks-text-center py-8">No interest activity found for your clients.</td></tr>}
                    {interestsStatus.map(item => (
                      <tr key={item.interestId}>
                        <td>
                          <span style={{ 
                            padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold',
                            backgroundColor: item.direction === 'Sent' ? '#eef2ff' : '#fef2f2', 
                            color: item.direction === 'Sent' ? '#4f46e5' : '#dc2626' 
                          }}>
                            {item.direction === 'Sent' ? '↗ Sent' : '↙ Received'}
                          </span>
                        </td>
                        <td>
                          <div className="ks-cell-primary">{item.myClient?.firstName} {item.myClient?.lastName}</div>
                          <div className="ks-cell-secondary">{item.myClient?.uniqueId}</div>
                        </td>
                        <td>
                          <div className="ks-cell-primary">{item.matchProfile?.firstName} {item.matchProfile?.lastName}</div>
                          <div className="ks-cell-secondary">{item.matchProfile?.uniqueId}</div>
                        </td>
                        <td className="ks-cell-secondary">
                          {new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric'})}
                        </td>
                        <td>{renderStatusBadge(item.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* --- RIGHT SLIDE-OVER DRAWER FOR REGISTRATION --- */}
      <div className={`ks-drawer-overlay ${isDrawerOpen ? 'open' : ''}`} onClick={() => setIsDrawerOpen(false)}></div>
      <div className={`ks-drawer-panel ${isDrawerOpen ? 'open' : ''}`}>
        
        <div className="ks-drawer-header">
          <div>
            <h2>Register New Client</h2>
            <p>Enter client details below. They will be linked to your agent ID automatically.</p>
          </div>
          <button className="ks-icon-btn" onClick={() => setIsDrawerOpen(false)}><X size={24} /></button>
        </div>

        <div className="ks-drawer-body">
          <form id="ks-agent-reg-form" onSubmit={handleRegisterSubmit}>
            {/* 1. Account & Contact */}
            <div className="ks-form-section">
              <h3>Account Credentials</h3>
              <div className="ks-form-grid">
                <div className="ks-input-wrap">
                  <label>Email Address</label>
                  <input type="email" name="email" value={regData.email} onChange={handleRegChange} required />
                </div>
                <div className="ks-input-wrap">
                  <label>Mobile Number</label>
                  <input type="tel" name="mobileNumber" value={regData.mobileNumber} onChange={handleRegChange} required />
                </div>
                <div className="ks-input-wrap ks-col-span-2">
                  <label>Temporary Password</label>
                  <input type="text" name="password" value={regData.password} onChange={handleRegChange} required />
                </div>
              </div>
            </div>

            {/* 2. Personal */}
            <div className="ks-form-section">
              <h3>Personal Details</h3>
              <div className="ks-form-grid">
                <div className="ks-input-wrap">
                  <label>Profile Created For</label>
                  <select name="profileFor" value={regData.profileFor} onChange={handleRegChange}>
                    <option>Myself</option><option>Son</option><option>Daughter</option><option>Brother</option><option>Sister</option><option>Relative</option><option>Client</option>
                  </select>
                </div>
                <div className="ks-input-wrap">
                  <label>Gender</label>
                  <select name="gender" value={regData.gender} onChange={handleRegChange}>
                    <option>Male</option><option>Female</option>
                  </select>
                </div>
                <div className="ks-input-wrap">
                  <label>First Name</label>
                  <input type="text" name="firstName" value={regData.firstName} onChange={handleRegChange} required />
                </div>
                <div className="ks-input-wrap">
                  <label>Last Name</label>
                  <input type="text" name="lastName" value={regData.lastName} onChange={handleRegChange} required />
                </div>
                <div className="ks-input-wrap">
                  <label>Date of Birth</label>
                  <input type="date" name="dob" value={regData.dob} onChange={handleRegChange} required />
                </div>
                <div className="ks-input-wrap">
                  <label>Height (e.g. 5.8)</label>
                  <input type="number" step="0.1" name="height" value={regData.height} onChange={handleRegChange} required />
                </div>
                <div className="ks-input-wrap">
                  <label>Marital Status</label>
                  <select name="maritalStatus" value={regData.maritalStatus} onChange={handleRegChange}>
                    <option>Never Married</option><option>Divorced</option><option>Widowed</option>
                  </select>
                </div>
                <div className="ks-input-wrap">
                  <label>Diet</label>
                  <select name="diet" value={regData.diet} onChange={handleRegChange}>
                    <option>Veg</option><option>Non-Veg</option><option>Eggetarian</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Cultural */}
            <div className="ks-form-section">
              <h3>Socio-Cultural</h3>
              <div className="ks-form-grid">
                <div className="ks-input-wrap">
                  <label>Religion</label>
                  <select name="religion" value={regData.religion} onChange={handleRegChange}>
                    <option>Hindu</option><option>Muslim</option><option>Christian</option><option>Sikh</option><option>Other</option>
                  </select>
                </div>
                <div className="ks-input-wrap">
                  <label>Community (Language)</label>
                  <select name="community" value={regData.community} onChange={handleRegChange}>
                    {COMMUNITY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                
                {/* MERGED CASTE & SUB-COMMUNITY AS ONE DROPDOWN */}
                <div className="ks-input-wrap ks-col-span-2">
                  <label>Caste / Sub-Community</label>
                  <select name="caste" value={regData.caste} onChange={handleRegChange} required>
                    <option value="" disabled>Select Caste</option>
                    {CASTE_OPTIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 4. Professional */}
            <div className="ks-form-section">
              <h3>Education & Career</h3>
              <div className="ks-form-grid">
                <div className="ks-input-wrap">
                  <label>Education</label>
                  <select name="highestQualification" value={regData.highestQualification} onChange={handleRegChange}>
                    <option value="" disabled>Select Education</option>
                    {EDU_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div className="ks-input-wrap">
                  <label>College/University</label>
                  <input type="text" name="collegeName" value={regData.collegeName} onChange={handleRegChange} />
                </div>
                <div className="ks-input-wrap">
                  <label>Work Sector</label>
                  <select name="workType" value={regData.workType} onChange={handleRegChange}>
                    <option>Private</option><option>Government</option><option>Business</option><option>Self-Employed</option>
                  </select>
                </div>
                <div className="ks-input-wrap">
                  <label>Job Role</label>
                  <input type="text" name="jobRole" value={regData.jobRole} onChange={handleRegChange} />
                </div>
                <div className="ks-input-wrap">
                  <label>Company Name</label>
                  <input type="text" name="companyName" value={regData.companyName} onChange={handleRegChange} />
                </div>
                <div className="ks-input-wrap">
                  <label>Annual Income</label>
                  <input type="text" name="annualIncome" placeholder="e.g. 6-8 LPA" value={regData.annualIncome} onChange={handleRegChange} />
                </div>
              </div>
            </div>

            {/* 5. Location */}
            <div className="ks-form-section">
              <h3>Current Location</h3>
              <div className="ks-form-grid">
                <div className="ks-input-wrap">
                  <label>Country</label>
                  <input type="text" name="country" value={regData.country} onChange={handleRegChange} />
                </div>
                <div className="ks-input-wrap">
                  <label>State</label>
                  <input type="text" name="state" value={regData.state} onChange={handleRegChange} required />
                </div>
                <div className="ks-input-wrap ks-col-span-2">
                  <label>City</label>
                  <input type="text" name="city" value={regData.city} onChange={handleRegChange} required />
                </div>
              </div>
            </div>

          </form>
        </div>

        <div className="ks-drawer-footer">
          <button className="ks-btn-outline" onClick={() => setIsDrawerOpen(false)}>Cancel</button>
          <button type="submit" form="ks-agent-reg-form" className="ks-btn-primary" disabled={regLoading}>
            {regLoading ? 'Processing...' : 'Register Client'} <ChevronRight size={16} />
          </button>
        </div>

      </div>

      {/* RECEIPT MODAL */}
      {showImageModal && (
        <div className="ks-modal-overlay" onClick={() => setShowImageModal(null)}>
          <div className="ks-image-modal" onClick={e => e.stopPropagation()}>
            <button className="ks-close-abs" onClick={() => setShowImageModal(null)}><X size={24} /></button>
            <img src={showImageModal} alt="Receipt Proof" />
          </div>
        </div>
      )}

    </div>
  );
};

export default AgentDashboard;
