import React, { useState, useEffect } from 'react';
import Navbar from "../../Components/Navbar.jsx";
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';

// --- ICONS ---
const Icons = {
  MaleAvatar: () => (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="#cbd5e0" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" />
      <path d="M12.0002 14.5C6.99016 14.5 2.91016 17.86 2.91016 22C2.91016 22.28 3.13016 22.5 3.41016 22.5H20.5902C20.8702 22.5 21.0902 22.28 21.0902 22C21.0902 17.86 17.0102 14.5 12.0002 14.5Z" />
    </svg>
  ),
  FemaleAvatar: () => (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="#cbd5e0" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C9.24 2 7 4.24 7 7C7 9.76 9.24 12 12 12C14.76 12 17 9.76 17 7C17 4.24 14.76 2 12 2Z" />
      <path d="M12 14.5C7.5 14.5 3.5 17.5 3.5 21.5C3.5 21.78 3.72 22 4 22H20C20.28 22 20.5 21.78 20.5 21.5C20.5 17.5 16.5 14.5 12 14.5Z" />
    </svg>
  ),
  VerifiedBadge: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#C5A059" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="#C5A059" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 4L12 14.01L9 11.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  UploadIcon: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="17 8 12 3 7 8"></polyline>
      <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
  ),
  CopyIcon: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  ),
  CheckCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <path d="M22 4L12 14.01l-3-3"></path>
    </svg>
  )
};

const UserDashboard = () => {
  const navigate = useNavigate();
  
  // --- STATE ---
  const [matches, setMatches] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [regPaymentStatus, setRegPaymentStatus] = useState(null);

  // --- PHOTO UPLOAD STATE ---
  const [showPhotoUploadModal, setShowPhotoUploadModal] = useState(false);
  const [needsPhotos, setNeedsPhotos] = useState(false); // NEW: Tracks if user still needs to upload photos
  const [photoFiles, setPhotoFiles] = useState({ full: null, half: null, choice: null });
  const [photoUploadLoading, setPhotoUploadLoading] = useState(false);
  const [photoError, setPhotoError] = useState('');

  // --- PAYMENT MODAL STATE ---
  const [selectedProfile, setSelectedProfile] = useState(null); 
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); 
  const [paymentStep, setPaymentStep] = useState(1);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [copied, setCopied] = useState(false);

  // Form Fields
  const INTEREST_AMOUNT = "500"; 
  const UPI_ID = "8897714968@axl";
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshot, setScreenshot] = useState(null);

  const upiLink = `upi://pay?pa=${UPI_ID}&pn=Kalyana%20Shobha&am=${INTEREST_AMOUNT}&cu=INR`; 
  
  // API URLs
  const API_BASE_URL = "https://kalyanashobha-back.vercel.app/api/user";
  const PAYMENT_API_URL = "https://kalyanashobha-back.vercel.app/api/interest/submit-proof";
  const REG_STATUS_URL = "https://kalyanashobha-back.vercel.app/api/payment/registration/status"; 

  // --- INITIAL LOAD ---
  useEffect(() => {
    const loadDashboardData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      try {
        const matchResponse = await fetch(`${API_BASE_URL}/dashboard-matches`, {
          headers: { 'Content-Type': 'application/json', 'Authorization': token }
        });
        const matchData = await matchResponse.json();

        if (matchData.success) {
          setMatches(matchData.data);
          setIsPremium(matchData.isPremium);

          if (!matchData.isPremium) {
            const regStatusResponse = await fetch(REG_STATUS_URL, {
                headers: { 'Authorization': token }
            });
            const regStatusData = await regStatusResponse.json();
            if (regStatusData.success && regStatusData.paymentFound) {
                setRegPaymentStatus(regStatusData.data);
            }
          }
        } else {
          if(matchResponse.status === 401) { localStorage.removeItem('token'); navigate('/login'); }
          setError(matchData.message);
        }

        const photoStatusResponse = await fetch(`${API_BASE_URL}/photos-status`, {
           method: 'GET',
           headers: { 'Authorization': token }
        });
        const photoStatusData = await photoStatusResponse.json();
        
        // NEW: If no photos, set flags to show modal AND remember they need photos
        if (photoStatusData.success && !photoStatusData.hasPhotos) {
          setNeedsPhotos(true);
          setShowPhotoUploadModal(true);
        }
      } catch (err) { 
        setError("Server error."); 
      } finally { 
        setDashboardLoading(false); 
      }
    };

    loadDashboardData();
  }, [navigate]);

  // --- NEW: ACTION GUARD (Intercepts actions if photos are missing) ---
  const handleActionRequiringPhotos = (callback) => {
    if (needsPhotos) {
      setShowPhotoUploadModal(true); // Pop the modal back up!
    } else {
      callback(); // Proceed with the action
    }
  };

  // --- PHOTO UPLOAD HANDLERS ---
  const handlePhotoSelect = (type, file) => {
    setPhotoFiles(prev => ({ ...prev, [type]: file }));
  };

  const submitPhotos = async (e) => {
    e.preventDefault();
    setPhotoError('');

    if (!photoFiles.full || !photoFiles.half) {
      setPhotoError("Please upload at least the Full Length and Half Size photos.");
      return;
    }

    setPhotoUploadLoading(true);
    const token = localStorage.getItem('token');
    const formData = new FormData();

    formData.append('photos', photoFiles.full);
    formData.append('photos', photoFiles.half);
    if (photoFiles.choice) formData.append('photos', photoFiles.choice);

    try {
      const response = await fetch(`${API_BASE_URL}/upload-photos`, {
        method: 'POST',
        headers: { 'Authorization': token },
        body: formData 
      });

      const data = await response.json();
      if (data.success || response.ok) {
        setNeedsPhotos(false); // NEW: Mark photos as completed
        setShowPhotoUploadModal(false); 
      } else {
        setPhotoError(data.message || "Failed to upload photos.");
      }
    } catch (error) {
      setPhotoError("Network error during upload.");
    } finally {
      setPhotoUploadLoading(false);
    }
  };

  // --- CONNECT HANDLER ---
  const handleConnect = (profile) => {
    // Check if they need photos first!
    if (needsPhotos) {
      setShowPhotoUploadModal(true);
      return;
    }

    if (!isPremium && regPaymentStatus?.status === 'PendingVerification') {
      alert("Your verification is currently pending. Please wait for admin approval.");
      return;
    }
    if (!isPremium) {
      alert("Please verify your profile to connect.");
      navigate('/payment-registration');
      return;
    }
    setSelectedProfile(profile);
    setPaymentStep(1);
    setUtrNumber('');
    setScreenshot(null);
    setPaymentError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProfile(null);
    setTimeout(() => setPaymentStep(1), 300); 
  };

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePayClick = () => {
    window.location.href = upiLink;
    setTimeout(() => setPaymentStep(2), 2000);
  };

  const handleInterestSubmit = async (e) => {
    e.preventDefault();
    setPaymentError('');

    if (!utrNumber || !screenshot) {
      setPaymentError("Required: UTR Number and Screenshot.");
      return;
    }

    setPaymentLoading(true);
    const token = localStorage.getItem('token');

    try {
      const formData = new FormData();
      formData.append('receiverId', selectedProfile.id);
      formData.append('amount', INTEREST_AMOUNT);
      formData.append('utrNumber', utrNumber);
      formData.append('screenshot', screenshot);

      const response = await fetch(PAYMENT_API_URL, {
        method: 'POST',
        headers: { 'Authorization': token },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setMatches(prevMatches => prevMatches.map(m => {
            if (m.id === selectedProfile.id) return { ...m, interestStatus: 'PendingPaymentVerification' };
            return m;
        }));
        setShowModal(false); 
        setShowSuccess(true);
      } else {
        setPaymentError(data.message || "Submission failed.");
      }
    } catch (err) {
      setPaymentError("Network error.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const renderConnectButton = (profile) => {
    const status = profile.interestStatus; 
    if (status === 'PendingPaymentVerification' || status === 'PendingAdmin' || status === 'PendingUser') {
        return <button className="connect-btn" disabled style={{ backgroundColor: '#F39C12', cursor: 'default' }}>Requested</button>;
    }
    if (status === 'Accepted') {
        return <button className="connect-btn" disabled style={{ backgroundColor: '#27AE60', cursor: 'default' }}>Connected</button>;
    }
    if (status === 'Declined') {
        return <button className="connect-btn" disabled style={{ backgroundColor: '#DC2626', cursor: 'default' }}>Declined</button>;
    }
    return (
        <button className={`connect-btn ${!isPremium ? 'disabled-look' : ''}`} onClick={() => handleConnect(profile)}>
            {isPremium ? "Send Interest" : "Verify to Connect"}
        </button>
    );
  };

  if (dashboardLoading) return <div className="dashboard-loader"><div className="spinner"></div></div>;

  return (
    <>
      <Navbar />
      <div className={`dashboard-container ${showModal || showSuccess || showPhotoUploadModal ? 'blur-bg' : ''}`}>
        
        <div className="dashboard-header">

          <p>Matched based on your community and preferences.</p>
        </div>

        {/* --- PREMIUM BANNER --- */}
        {!isPremium && (
          <div className="premium-banner">
            {regPaymentStatus?.status === 'PendingVerification' ? (
              <>
                <div className="banner-content">
                  <h3>Verification Pending</h3>
                  <p>We are reviewing your payment of ₹{regPaymentStatus.amount}. UTR: {regPaymentStatus.utrNumber}</p>
                </div>
                <button className="upgrade-btn disabled-btn">In Review</button>
              </>
            ) : regPaymentStatus?.status === 'Rejected' ? (
              <>
                <div className="banner-content">
                  <h3>Verification Failed</h3>
                  <p>Your previous payment was rejected. Please try again.</p>
                </div>
                {/* Wrapped the Verify Action! */}
                <button className="upgrade-btn" onClick={() => handleActionRequiringPhotos(() => navigate('/payment-registration'))}>Retry</button>
              </>
            ) : (
              <>
                <div className="banner-content">
                  <h3>Action Required: Verify Your Profile</h3>
                  <p>Verify to become active and visible to others.</p>
                </div>
                {/* Wrapped the Verify Action! */}
                <button className="upgrade-btn" onClick={() => handleActionRequiringPhotos(() => navigate('/payment-registration'))}>Verify Now</button>
              </>
            )}
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
        {!dashboardLoading && matches.length === 0 && <div className="no-matches"><h3>No Matches Found</h3></div>}

        <div className="profiles-grid">
          {matches.map((profile) => (
            <div key={profile.id} className="profile-card">
              <div className="card-image">
                <div className="anonymous-avatar"><Icons.FemaleAvatar /></div>
                <span className="match-tag">95% Match</span>
              </div>
              <div className="card-details">
                <div className="card-header-row">
                  <div className="name-wrapper"><h3>{profile.name}</h3><span className="verify-badge"><Icons.VerifiedBadge/></span></div>
                  <span className="age-badge">{profile.age} Yrs</span>
                </div>
                <p className="job-role">{profile.job || "Not Specified"}</p>
                <div className="info-grid">
                  <div className="info-item"><span className="label">Education</span><span className="val">{profile.education || "--"}</span></div>
                  <div className="info-item"><span className="label">Community</span><span className="val">{profile.subCommunity || "--"}</span></div>
                  <div className="info-item"><span className="label">Status</span><span className="val">{profile.maritalStatus || "--"}</span></div>
                  <div className="info-item"><span className="label">Location</span><span className="val">{profile.location || "--"}</span></div>
                </div>
                <div className="card-actions">
                  {renderConnectButton(profile)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- PHOTO UPLOAD MODAL --- */}
      {showPhotoUploadModal && (
        <div className="ks-modal-overlay"> {/* Removed ks-blocking-overlay so it matches normal modals */}
          <div className="ks-checkout-modal photo-upload-modal fade-in">
            
            {/* NEW: Added a close button at the top */}
            <div className="ks-checkout-top">
              <button className="ks-close-btn" onClick={() => setShowPhotoUploadModal(false)}>✕</button>
            </div>

            <div className="ks-modal-header">
              <h2>Complete Your Profile</h2>
              <p>Upload photos to unlock full access</p>
            </div>
            
            <div className="ks-modal-content">
              <form onSubmit={submitPhotos}>
                <div className="ks-photo-group">
                  <label>1. Full Length Photo <span className="ks-req">*</span></label>
                  <div className={`ks-file-drop ${photoFiles.full ? 'ks-selected' : ''}`}>
                    <input type="file" accept="image/*" required onChange={(e) => handlePhotoSelect('full', e.target.files[0])} />
                    <div className="ks-drop-content">
                      <Icons.UploadIcon />
                      <span>{photoFiles.full ? photoFiles.full.name : "Choose full photo"}</span>
                    </div>
                  </div>
                </div>

                <div className="ks-photo-group">
                  <label>2. Passport Size Photo <span className="ks-req">*</span></label>
                  <div className={`ks-file-drop ${photoFiles.half ? 'ks-selected' : ''}`}>
                    <input type="file" accept="image/*" required onChange={(e) => handlePhotoSelect('half', e.target.files[0])} />
                     <div className="ks-drop-content">
                      <Icons.UploadIcon />
                      <span>{photoFiles.half ? photoFiles.half.name : "Choose passport photo"}</span>
                    </div>
                  </div>
                </div>

                <div className="ks-photo-group">
                  <label>3. Optional Casual Photo</label>
                  <div className={`ks-file-drop ${photoFiles.choice ? 'ks-selected' : ''}`}>
                    <input type="file" accept="image/*" onChange={(e) => handlePhotoSelect('choice', e.target.files[0])} />
                     <div className="ks-drop-content">
                      <Icons.UploadIcon />
                      <span>{photoFiles.choice ? photoFiles.choice.name : "Choose casual photo"}</span>
                    </div>
                  </div>
                </div>

                {photoError && <div className="ks-alert ks-alert-error">{photoError}</div>}

                <button type="submit" className="ks-btn-primary" disabled={photoUploadLoading}>
                  {photoUploadLoading ? "Uploading..." : "Save & Continue"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* --- STRIPE/RAZORPAY STYLE PAYMENT MODAL --- */}
      {/* ... [Rest of your Payment Modal code exactly as before] ... */}
      {showModal && selectedProfile && (
        <div className="ks-modal-overlay">
           <div className="ks-checkout-modal fade-in">
            <div className="ks-checkout-top">
              <button className="ks-close-btn" onClick={closeModal}>✕</button>
            </div>
            
            <div className="ks-checkout-header">
              <p className="ks-merchant-name">Kalyana Shobha Interest Request</p>
              <h2 className="ks-checkout-amount">₹{INTEREST_AMOUNT}.00</h2>
              <p className="ks-checkout-desc">Connecting with {selectedProfile.name}</p>
            </div>

            <div className="ks-checkout-body">
              {paymentStep === 1 && (
                <div className="ks-step-slide">
                  <div className="ks-upi-box">
                    <div className="ks-upi-details">
                      <span className="ks-upi-label">Pay via UPI App or Copy ID</span>
                      <span className="ks-upi-id">{UPI_ID}</span>
                    </div>
                    <button className="ks-copy-btn" onClick={handleCopyUPI} title="Copy UPI ID">
                      {copied ? <span className="ks-copied-text">Copied!</span> : <Icons.CopyIcon />}
                    </button>
                  </div>

                  <button className="ks-btn-primary" onClick={handlePayClick}>
                    Open UPI App
                  </button>
                  
                  <div className="ks-divider">
                    <span>or</span>
                  </div>

                  <button className="ks-btn-secondary" onClick={() => setPaymentStep(2)}>
                    I have already paid
                  </button>
                </div>
              )}

              {paymentStep === 2 && (
                <form onSubmit={handleInterestSubmit} className="ks-step-slide fade-in">
                  <div className="ks-checkout-nav">
                    <span onClick={() => setPaymentStep(1)}>← Back to payment methods</span>
                  </div>

                  <div className="ks-input-group">
                    <label>Transaction Reference (UTR)</label>
                    <input 
                      type="text" 
                      placeholder="Enter 12-digit UTR number" 
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                    />
                  </div>

                  <div className="ks-input-group">
                    <label>Payment Screenshot</label>
                    <div className="ks-file-input-wrapper">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => setScreenshot(e.target.files[0])}
                      />
                      <div className="ks-file-input-display">
                        <Icons.UploadIcon />
                        <span>{screenshot ? screenshot.name : "Attach Screenshot"}</span>
                      </div>
                    </div>
                  </div>

                  {paymentError && <div className="ks-alert ks-alert-error">{paymentError}</div>}

                  <button type="submit" className="ks-btn-primary" disabled={paymentLoading}>
                    {paymentLoading ? "Processing..." : "Submit for Verification"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- SUCCESS MODAL --- */}
      {showSuccess && (
        <div className="ks-modal-overlay">
          <div className="ks-checkout-modal ks-success-state fade-in">
            <div className="ks-success-icon"><Icons.CheckCircle /></div>
            <h3>Request Submitted</h3>
            <p>Your payment is being verified by the admin. The interest will be sent shortly.</p>
            <button className="ks-btn-primary" onClick={() => setShowSuccess(false)}>Done</button>
          </div>
        </div>
      )}
    </>
  );
};

export default UserDashboard;
