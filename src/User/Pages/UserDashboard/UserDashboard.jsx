import React, { useState, useEffect } from 'react';
import Navbar from "../../Components/Navbar.jsx"; 
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import './UserDashboard.css';

// --- SVG ICONS ---
const Icons = {
  Female: () => 
    <svg viewBox="0 0 24 24" fill="none" width="100%" height="100%">
      {/* Head: Red */}
      <path 
        d="M12 14C7.33 14 4 17.33 4 22H20C20 17.33 16.67 14 12 14Z" 
        fill="#F59E0B" 
      />
      {/* Body: Amber/Yellow */}
            <path 
        d="M12 2C9.24 2 7 4.24 7 7C7 9.76 9.24 12 12 12C14.76 12 17 9.76 17 7C17 4.24 14.76 2 12 2Z" 
        fill="#DC2626" 
      />
    </svg>,
  Male: () => <svg viewBox="0 0 24 24" fill="#3B82F6" width="100%" height="100%"><path d="M12 2C9.24 2 7 4.24 7 7C7 9.76 9.24 12 12 12C14.76 12 17 9.76 17 7C17 4.24 14.76 2 12 2ZM12 14C7.33 14 4 17.33 4 22H20C20 17.33 16.67 14 12 14Z"/></svg>,
  Verify: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  Upload: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>,
  Copy: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>,
  Lock: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>,
  Search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  Filter: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>,
  ChevronDown: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
};

// --- DATA OPTIONS FOR DROPDOWNS ---
const EDUCATION_OPTIONS = ["Any", "B.Tech", "M.Tech", "MBA", "MBBS", "Degree", "MCA", "Ph.D", "Diploma", "Other"];
const MARITAL_STATUS_OPTIONS = ["Any", "Never Married", "Divorced", "Widowed", "Awaiting Divorce"];
const COMMUNITY_OPTIONS = ["Any", "Reddy", "Kamma", "Kapu", "Brahmin", "Vysya", "SC", "ST", "BC", "Muslim", "Christian", "Other"];
const OCCUPATION_OPTIONS = ["Any", "Software Engineer", "Doctor", "Government Job", "Business", "Teacher", "Banker", "Civil Services", "Other"];
const SALARY_OPTIONS = [
  { label: "Any", value: "" },
  { label: "3+ LPA", value: "300000" },
  { label: "5+ LPA", value: "500000" },
  { label: "10+ LPA", value: "1000000" },
  { label: "15+ LPA", value: "1500000" },
  { label: "25+ LPA", value: "2500000" },
];

// --- SKELETON LOADER ---
const DashboardSkeleton = () => (
  <div className="ud-grid">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="ud-skeleton-card">
        <div className="ud-sk-circle ud-sk-animate"></div>
        <div className="ud-sk-line ud-w-80 ud-sk-animate"></div>
        <div className="ud-sk-line ud-w-40 ud-sk-animate"></div>
        <div className="ud-sk-block ud-sk-animate"></div>
      </div>
    ))}
  </div>
);

const UserDashboard = () => {
  const navigate = useNavigate();

  // --- STATE ---
  const [matches, setMatches] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [regPaymentStatus, setRegPaymentStatus] = useState(null);

  // --- SEARCH STATE ---
  const [showFilters, setShowFilters] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [filters, setFilters] = useState({
    searchId: '',
    minAge: '', maxAge: '',
    minHeight: '', maxHeight: '',
    minSalary: '',
    education: '',
    subCommunity: '',
    occupation: '',
    maritalStatus: ''
  });

  // --- PHOTO & PAYMENT STATE ---
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [needsPhotos, setNeedsPhotos] = useState(false);
  const [photoFiles, setPhotoFiles] = useState({ full: null, half: null, choice: null });
  const [uploading, setUploading] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState(1);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshot, setScreenshot] = useState(null);

  // --- CONSTANTS ---
  const INTEREST_AMOUNT = "500";
  const UPI_ID = "8897714968@axl";
  const API_BASE_URL = "https://kalyanashobha-back.vercel.app/api/user";
  const upiDeepLink = `upi://pay?pa=${UPI_ID}&pn=Kalyana%20Shobha&am=${INTEREST_AMOUNT}&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiDeepLink)}`;

  // --- INITIAL LOAD ---
  useEffect(() => {
    fetchFeedAndData({});
  }, []);

  const fetchFeedAndData = async (filterData) => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    try {
      setSearchLoading(true);
      const feedRes = await fetch(`${API_BASE_URL}/dashboard/feed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: JSON.stringify(filterData)
      });
      const feedData = await feedRes.json();

      if (feedData.success) {
        setMatches(feedData.data);
        setIsPremium(feedData.isPremium || false);
        
        if (Object.keys(filterData).length > 0 && feedData.count > 0) {
            toast.success(`Found ${feedData.count} matches`);
        } else if (Object.keys(filterData).length > 0 && feedData.count === 0) {
            toast("No matches found");
        }

        if (!feedData.isPremium) {
          const regRes = await fetch("https://kalyanashobha-back.vercel.app/api/payment/registration/status", { 
              headers: { 'Authorization': token } 
          });
          const regData = await regRes.json();
          if (regData.success && regData.paymentFound) setRegPaymentStatus(regData.data);
        }
      } else {
        if (feedRes.status === 401) { localStorage.removeItem('token'); navigate('/login'); }
        toast.error(feedData.message || "Failed to load data");
      }

      const photoRes = await fetch(`${API_BASE_URL}/photos-status`, { headers: { 'Authorization': token } });
      const photoData = await photoRes.json();
      if (photoData.success && !photoData.hasPhotos) {
        setNeedsPhotos(true);
        // Do NOT auto-show modal here, just set the state.
        // We will show it when they try to Verify.
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    } finally {
      setDashboardLoading(false);
      setSearchLoading(false);
    }
  };

  // --- HANDLERS ---
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value === "Any" ? "" : value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!isPremium) return toast.error("Upgrade to Premium to search matches!");
    fetchFeedAndData(filters);
  };

  const clearFilters = () => {
    const emptyFilters = { 
        searchId: '', minAge: '', maxAge: '', minHeight: '', maxHeight: '', 
        minSalary: '', education: '', subCommunity: '', occupation: '', maritalStatus: '' 
    };
    setFilters(emptyFilters);
    fetchFeedAndData(emptyFilters); 
  };

  // --- UPDATED HANDLER ---
  const handleVerifyClick = () => {
    // If already paid and waiting, show a toast instead of navigating
    if (regPaymentStatus?.status === 'PendingVerification') {
        toast("Verification is currently in progress. Please wait for admin approval.", { icon: '⏳' });
        return;
    }

    if (needsPhotos) {
        setShowPhotoModal(true);
    } else {
        navigate('/payment-registration');
    }
  };

  
    // --- ADD THIS FUNCTION ---
  const handlePhotoSelect = (type, file) => {
    if (file) {
      setPhotoFiles(prev => ({
        ...prev,
        [type]: file
      }));
    }
  };


  const submitPhotos = async (e) => {
    e.preventDefault();
    if (!photoFiles.full || !photoFiles.half) return toast.error("Essential photos required");
    setUploading(true);
    const formData = new FormData();
    formData.append('photos', photoFiles.full);
    formData.append('photos', photoFiles.half);
    if (photoFiles.choice) formData.append('photos', photoFiles.choice);
    try {
      const res = await fetch(`${API_BASE_URL}/upload-photos`, {
        method: 'POST', headers: { 'Authorization': localStorage.getItem('token') }, body: formData
      });
      const data = await res.json();
      if (data.success || res.ok) { 
          setNeedsPhotos(false); 
          setShowPhotoModal(false); 
          toast.success("Photos updated");
          // After successful upload, redirect to payment
          navigate('/payment-registration');
      } 
      else { toast.error(data.message); }
    } catch { toast.error("Network error"); } finally { setUploading(false); }
  };

  const handleConnect = (profile) => {
    if (needsPhotos) {
        setShowPhotoModal(true);
        return;
    } 
    if (!isPremium) {
       if (regPaymentStatus?.status === 'PendingVerification') toast("Verification in progress");
       else handleVerifyClick(); // Use shared logic
       return;
    }
    setSelectedProfile(profile);
    setPaymentStep(1);
    setShowPayModal(true);
  };

  const submitInterest = async (e) => {
    e.preventDefault();
    if (!utrNumber || !screenshot) return toast.error("Payment proof required");
    setPaymentLoading(true);
    const formData = new FormData();
    formData.append('receiverId', selectedProfile.id);
    formData.append('amount', INTEREST_AMOUNT);
    formData.append('utrNumber', utrNumber);
    formData.append('screenshot', screenshot);
    try {
      const res = await fetch("https://kalyanashobha-back.vercel.app/api/interest/submit-proof", {
        method: 'POST', headers: { 'Authorization': localStorage.getItem('token') }, body: formData
      });
      const data = await res.json();
      if (data.success) {
        setMatches(prev => prev.map(m => m.id === selectedProfile.id ? { ...m, interestStatus: 'PendingPaymentVerification' } : m));
        setShowPayModal(false);
        toast.success("Interest sent successfully");
      } else { toast.error(data.message); }
    } catch { toast.error("Network error"); } finally { setPaymentLoading(false); }
  };

  const renderStatusBtn = (status) => {
    if (['PendingPaymentVerification', 'PendingAdmin', 'PendingUser', 'Accepted', 'Declined'].includes(status)) {
        return <button className="ud-btn ud-btn-disabled" disabled>{status.replace(/([A-Z])/g, ' $1').trim()}</button>;
    }
    return (
      <button className={`ud-btn ${!isPremium ? 'ud-btn-locked' : 'ud-btn-accent'}`} onClick={() => handleConnect(selectedProfile)}>
        {!isPremium ? <><Icons.Lock /> Verify to Connect</> : "Send Interest"}
      </button>
    );
  };

  return (
    <>
      <Navbar />
      <Toaster toastOptions={{ style: { background: '#1e293b', color: '#fff', fontFamily: 'Inter' } }} />

      <div className="ud-dashboard">
        <div className="ud-container ud-header-section">
          <p className="ud-subtitle">Find your perfect match</p>
        </div>

        {dashboardLoading ? <DashboardSkeleton /> : (
          <div className="ud-container">
            
            {/* --- SEARCH SECTION --- */}
            <div className="ud-search-section">
              <div className="ud-search-card">
                
                {/* --- UPDATED OVERLAY LOGIC --- */}
                {!isPremium && (
                  <div 
                    className="ud-search-locked-overlay" 
                    onClick={handleVerifyClick}
                    // Change cursor to default if pending so it doesn't look clickable
                    style={{ cursor: regPaymentStatus?.status === 'PendingVerification' ? 'default' : 'pointer' }}
                  >
                    {regPaymentStatus?.status === 'PendingVerification' ? (
                      <>
                        {/* PENDING STATE UI */}
{/* PENDING STATE UI */}
<div className="ud-pending-status"> {/* <--- Added this class */}
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
  Verification Pending
</div>

                        <p className="ud-subtitle" style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                          Payment submitted. Waiting for admin approval.
                        </p>
                      </>
                    ) : (
                      <>
                        {/* DEFAULT LOCKED STATE UI */}
                        <div className="ud-lock-msg"><Icons.Lock /> Premium Search</div>
                        <p className="ud-subtitle" style={{ fontSize: '0.8rem' }}>
                          Verify profile to use Advanced Filters
                        </p>
                      </>
                    )}
                  </div>
                )}


                <div className="ud-search-bar">
                  <div className="ud-search-input-group">
                    <div className="ud-search-icon-box"><Icons.Search /></div>
                    <input 
                      type="text" 
                      name="searchId"
                      className="ud-main-search-input" 
                      placeholder="Search by ID (e.g. KS1023)..." 
                      value={filters.searchId}
                      onChange={handleFilterChange}
                      disabled={!isPremium}
                    />
                  </div>
                  <button 
                    className={`ud-filter-toggle ${showFilters ? 'active' : ''}`} 
                    onClick={() => isPremium && setShowFilters(!showFilters)}
                    disabled={!isPremium}
                  >
                    <Icons.Filter /> Advanced <Icons.ChevronDown />
                  </button>
                  <button 
                    className="ud-btn ud-btn-primary" 
                    style={{width:'auto', padding:'0.75rem 1.5rem'}}
                    onClick={handleSearch}
                    disabled={!isPremium || searchLoading}
                  >
                    {searchLoading ? 'Searching...' : 'Search'}
                  </button>
                </div>

                {/* --- FILTERS PANEL --- */}
                {showFilters && isPremium && (
                  <div className="ud-filters-panel">
                    <div className="ud-filters-grid">
                      {/* ... Filters (Same as before) ... */}
                      <div className="ud-form-group">
                        <label className="ud-label">Age (Years)</label>
                        <div style={{display:'flex', gap:'0.5rem'}}>
                           <input type="number" name="minAge" placeholder="Min" className="ud-input" value={filters.minAge} onChange={handleFilterChange}/>
                           <input type="number" name="maxAge" placeholder="Max" className="ud-input" value={filters.maxAge} onChange={handleFilterChange}/>
                        </div>
                      </div>
                      <div className="ud-form-group">
                        <label className="ud-label">Marital Status</label>
                        <select name="maritalStatus" className="ud-input" value={filters.maritalStatus} onChange={handleFilterChange}>
                           {MARITAL_STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </div>
                      <div className="ud-form-group">
                        <label className="ud-label">Education</label>
                        <select name="education" className="ud-input" value={filters.education} onChange={handleFilterChange}>
                           {EDUCATION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </div>
                      <div className="ud-form-group">
                         <label className="ud-label">Community</label>
                         <select name="subCommunity" className="ud-input" value={filters.subCommunity} onChange={handleFilterChange}>
                            {COMMUNITY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                         </select>
                      </div>
                       <div className="ud-form-group">
                         <label className="ud-label">Occupation</label>
                         <select name="occupation" className="ud-input" value={filters.occupation} onChange={handleFilterChange}>
                            {OCCUPATION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                         </select>
                      </div>
                      <div className="ud-form-group">
                         <label className="ud-label">Min Annual Income</label>
                         <select name="minSalary" className="ud-input" value={filters.minSalary} onChange={handleFilterChange}>
                            {SALARY_OPTIONS.map(opt => <option key={opt.label} value={opt.value}>{opt.label}</option>)}
                         </select>
                      </div>
                      <div className="ud-form-group">
                        <label className="ud-label">Height (Cm)</label>
                        <div style={{display:'flex', gap:'0.5rem'}}>
                           <input type="number" name="minHeight" placeholder="Min" className="ud-input" value={filters.minHeight} onChange={handleFilterChange}/>
                           <input type="number" name="maxHeight" placeholder="Max" className="ud-input" value={filters.maxHeight} onChange={handleFilterChange}/>
                        </div>
                      </div>
                    </div>
                    <div className="ud-filter-actions">
                      <button className="ud-btn ud-btn-outline" style={{width:'auto'}} onClick={clearFilters}>Reset All</button>
                      <button className="ud-btn ud-btn-accent" style={{width:'auto'}} onClick={handleSearch}>Apply Filters</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* --- BANNER --- */}
            {!isPremium && regPaymentStatus?.status !== 'PendingVerification' && (
              <div className="ud-banner">
                <div className="ud-banner-info"><h3>Complete Verification</h3><p>Unlock premium features to connect with profiles.</p></div>
                <button className="ud-btn ud-btn-primary" style={{width:'auto'}} onClick={handleVerifyClick}>Verify Now</button>
              </div>
            )}

            {/* --- EMPTY STATE --- */}
            {matches.length === 0 && (
              <div className="ud-empty-state">
                <div style={{width:'60px', height:'60px', margin:'0 auto', color:'#cbd5e1'}}><Icons.Search /></div>
                <h3>No Matches Found</h3>
                <p>Try adjusting your filters.</p>
                {filters.searchId || filters.minAge ? (
                    <button className="ud-btn ud-btn-outline" style={{marginTop:'1rem', width:'auto', display:'inline-flex'}} onClick={clearFilters}>Clear Filters</button>
                ) : null}
              </div>
            )}

            {/* --- GRID --- */}
            <div className="ud-grid">
              {matches.map((profile) => (
                <div key={profile.id} className="ud-card">
                  <div className="ud-card-header">
                    <div className="ud-avatar-box">
                      {profile.gender === 'Male' ? <Icons.Male /> : <Icons.Female />}
                    </div>
                  </div>
                  <div className="ud-card-body">
                    <div className="ud-profile-header">
                      <div className="ud-name">{profile.name} <Icons.Verify /></div>
                      <span className="ud-age-badge">{profile.age} Yrs</span>
                    </div>
                    <p className="ud-job">{profile.occupation || profile.job || "Not Specified"}</p>
                    <div className="ud-info-grid">
                      <div className="ud-info-item"><span className="ud-lbl">Education</span><span className="ud-val">{profile.education || "--"}</span></div>
                      <div className="ud-info-item"><span className="ud-lbl">Community</span><span className="ud-val">{profile.subCommunity || profile.community || "--"}</span></div>
                      <div className="ud-info-item"><span className="ud-lbl">Location</span><span className="ud-val">{profile.location || "--"}</span></div>
                      <div className="ud-info-item"><span className="ud-lbl">ID</span><span className="ud-val">{profile.uniqueId || "--"}</span></div>
                      <div className="ud-info-item"><span className="ud-lbl">Height</span><span className="ud-val">{profile.height ? `${profile.height} cm` : "--"}</span></div>
                      <div className="ud-info-item"><span className="ud-lbl">Status</span><span className="ud-val">{profile.status || "--"}</span></div>
                    </div>
                    <div onClick={() => handleConnect(profile)} style={{marginTop:'auto'}}>
                       {renderStatusBtn(profile.interestStatus)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* --- PHOTO MODAL --- */}
      {showPhotoModal && (
        <div className="ud-overlay">
          <div className="ud-modal">
            <button className="ud-close-btn" onClick={() => setShowPhotoModal(false)}>✕</button>
            <h2 className="ud-title">Profile Photos Required</h2>
            <p className="ud-subtitle" style={{marginBottom:'1.5rem'}}>Upload your photos to proceed with verification.</p>
            <form onSubmit={submitPhotos}>
              {['full', 'half', 'choice'].map((type) => (
                <div key={type} className="ud-form-group">
                  <label className="ud-label">{type === 'full' ? 'Full Body' : type === 'half' ? 'Passport Size' : 'Casual (Optional)'}</label>
                  <div className={`ud-upload-zone ${photoFiles[type] ? 'active' : ''}`}>
                    <input className="ud-file-input" type="file" accept="image/*" onChange={(e) => handlePhotoSelect(type, e.target.files[0])} />
                    <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'0.5rem'}}>
                      <Icons.Upload /><span className="ud-lbl">{photoFiles[type] ? photoFiles[type].name : "Click to Upload"}</span>
                    </div>
                  </div>
                </div>
              ))}
              <button type="submit" className="ud-btn ud-btn-primary" disabled={uploading}>{uploading ? "Uploading..." : "Save & Continue to Payment"}</button>
            </form>
          </div>
        </div>
      )}

      {/* --- PAYMENT MODAL --- */}
      {showPayModal && selectedProfile && (
        <div className="ud-overlay">
          <div className="ud-modal">
            <button className="ud-close-btn" onClick={() => setShowPayModal(false)}>✕</button>
            <div className="ud-pay-header">
              <p className="ud-lbl">Connect Request</p>
              <div className="ud-pay-amount">₹{INTEREST_AMOUNT}</div>
              <p className="ud-pay-desc">Pay to connect with {selectedProfile.name}</p>
            </div>
            {paymentStep === 1 ? (
              <>
                <a href={upiDeepLink} className="ud-mobile-pay-btn">Pay Now via UPI App</a>
                <div className="ud-qr-container">
                  <div className="ud-qr-code"><img src={qrCodeUrl} alt="Scan to Pay" style={{display:'block', width:'100%', maxWidth:'200px'}}/></div>
                  <div className="ud-copy-row"><span>{UPI_ID}</span><button onClick={() => { navigator.clipboard.writeText(UPI_ID); toast.success("Copied"); }} style={{background:'none', border:'none', cursor:'pointer'}}><Icons.Copy /></button></div>
                </div>
                <div className="ud-pay-actions"><button className="ud-btn ud-btn-outline" onClick={() => setPaymentStep(2)}>I have completed payment</button></div>
              </>
            ) : (
              <form onSubmit={submitInterest}>
                 <div className="ud-form-group"><label className="ud-label">UTR / Transaction ID</label><input className="ud-input" placeholder="e.g. 328109..." value={utrNumber} onChange={(e) => setUtrNumber(e.target.value)} required/></div>
                 <div className="ud-form-group"><label className="ud-label">Screenshot</label><div className="ud-upload-zone sm"><input className="ud-file-input" type="file" accept="image/*" onChange={(e) => setScreenshot(e.target.files[0])} required /><span className="ud-lbl">{screenshot ? screenshot.name : "Attach Proof"}</span></div></div>
                 <div style={{display:'flex', gap:'1rem'}}><button type="button" className="ud-btn ud-btn-outline" onClick={() => setPaymentStep(1)}>Back</button><button type="submit" className="ud-btn ud-btn-primary" disabled={paymentLoading}>{paymentLoading ? "Verifying..." : "Submit"}</button></div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UserDashboard;
