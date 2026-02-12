import React, { useState, useEffect } from 'react';
import './Interests.css';
import Navbar from "../Components/Navbar.jsx";

const Interests = () => {
  const [activeTab, setActiveTab] = useState('received'); 
  const [sentList, setSentList] = useState([]);
  const [receivedList, setReceivedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Default Avatar URL (Generic User)
  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const API_BASE = "https://kalyanashobha-back.vercel.app/api/user";

  useEffect(() => {
    fetchInterests();
  }, []);

  const fetchInterests = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    setError('');
    
    try {
      const resSent = await fetch(`${API_BASE}/interests/sent`, { 
        headers: { 'Content-Type': 'application/json', 'Authorization': token } 
      });
      const dataSent = await resSent.json();
      if (dataSent.success) setSentList(dataSent.data || []);

      const resRec = await fetch(`${API_BASE}/interests/received`, { 
        headers: { 'Content-Type': 'application/json', 'Authorization': token } 
      });
      const dataRec = await resRec.json();
      if (dataRec.success) setReceivedList(dataRec.data || []);

    } catch (err) {
      console.error("Error fetching interests:", err);
      setError("Failed to load connections.");
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (interestId, action) => {
    const token = localStorage.getItem('token');
    if(!window.confirm(`Are you sure you want to ${action} this request?`)) return;

    try {
      const res = await fetch(`${API_BASE}/interest/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: JSON.stringify({ interestId: interestId, action: action })
      });
      
      const data = await res.json();
      if (data.success) {
        alert("Success!");
        fetchInterests(); 
      } else {
        alert("Action failed: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Network error.");
    }
  };

  // --- RENDER: 1. ACCEPTED CONTACTS (Premium Style) ---
  const renderAccepted = () => {
    const acceptedSent = sentList.filter(i => i.status === 'Accepted');
    const acceptedRec = receivedList.filter(i => i.status === 'Accepted');
    const allAccepted = [...acceptedSent, ...acceptedRec];

    if (allAccepted.length === 0) return <div className="empty-state">No connected profiles yet.</div>;

    return (
      <div className="card-grid">
        {allAccepted.map((item) => {
          const isSender = sentList.some(s => s._id === item._id);
          const profile = isSender ? item.receiverProfile : item.senderId;

          return (
            <div className="interest-card accepted-card" key={item._id}>
              <div className="premium-header">
                {/* Default Avatar Used Here */}
                <img src={defaultAvatar} alt="Profile" className="premium-avatar" />
                
                <div className="status-badge-premium mt-2">
                  <span className="dot"></span> Connected
                </div>
                <h4>{profile?.firstName || profile?.name} {profile?.lastName}</h4>
                <div className="gold-divider"></div>
              </div>
              
              <div className="premium-details">
                <div className="detail-row">
                  <span className="detail-label">Profile ID</span>
                  <span className="detail-value">{profile?.uniqueId || profile?.uniqueid || "N/A"}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Mobile</span>
                  <span className="detail-value highlight">{profile?.mobileNumber || profile?.mobile || "N/A"}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email</span>
                  <span className="detail-value email-text">{profile?.email || "N/A"}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // --- RENDER: 2. RECEIVED REQUESTS (Premium Style) ---
  const renderReceived = () => {
    const list = receivedList.filter(i => i.status !== 'Accepted'); 
    if (list.length === 0) return <div className="empty-state">No new requests received.</div>;

    return (
      <div className="card-grid">
        {list.map((item) => (
          <div className="interest-card accepted-card" key={item._id}>
            <div className="premium-header">
              <img src={defaultAvatar} alt="Profile" className="premium-avatar" />
              
              <h4>{item.senderId?.firstName} {item.senderId?.lastName}</h4>
              <p className="premium-subtitle">
                {item.senderId?.jobRole || "Member"} <br/>
                <span className="loc">{item.senderId?.city}, {item.senderId?.state}</span>
              </p>
              <div className="gold-divider"></div>
            </div>

            <div className="premium-details pb-0">
               {/* Details visible before accepting */}
<div className="detail-row">
  <span className="detail-label">ID </span>
  <span className="detail-value">
     {item.senderId?.uniqueId || "N/A"}
  </span>
</div>

            </div>

            <div className="card-actions-premium">
               {item.status === 'PendingUser' || item.status === 'Pending' ? (
                 <>
                   <button onClick={() => handleRespond(item._id, 'accept')} className="btn-accept">Accept Request</button>
                   <button onClick={() => handleRespond(item._id, 'decline')} className="btn-decline">Decline</button>
                 </>
               ) : (
                 <span className={`status-pill ${item.status}`}>{item.status}</span>
               )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // --- RENDER: 3. SENT REQUESTS (Premium Style) ---
  const renderSent = () => {
    const list = sentList.filter(i => i.status !== 'Accepted'); 
    if (list.length === 0) return <div className="empty-state">No pending sent requests.</div>;

    return (
      <div className="card-grid">
        {list.map((item) => (
          <div className="interest-card accepted-card" key={item._id}>
            <div className="premium-header">
              <img src={defaultAvatar} alt="Profile" className="premium-avatar" />
              
              <h4>{item.receiverProfile?.name}</h4>
              <div className="gold-divider"></div>
            </div>

            <div className="premium-details">
                <div className="detail-row">
                  <span className="detail-label">Status</span>
                  <span className="detail-value">
                    <span className={`status-text ${item.status}`}>{item.status}</span>
                  </span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Date Sent</span>
                  <span className="detail-value">{new Date(item.date).toLocaleDateString()}</span>
                </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="interests-container">
        <div className="interests-header">
          <h2>Interests & Connections</h2>
          <div className="tabs-group">
            <button className={`tab-link ${activeTab === 'received' ? 'active' : ''}`} onClick={() => setActiveTab('received')}>Received</button>
            <button className={`tab-link ${activeTab === 'sent' ? 'active' : ''}`} onClick={() => setActiveTab('sent')}>Sent</button>
            <button className={`tab-link ${activeTab === 'accepted' ? 'active' : ''}`} onClick={() => setActiveTab('accepted')}>My Contacts</button>
          </div>
        </div>

        <div className="interests-content">
          {loading && <div className="loading-spinner">Loading...</div>}
          {error && <div className="empty-state error">{error}</div>}
          {!loading && !error && (
            <>
              {activeTab === 'received' && renderReceived()}
              {activeTab === 'sent' && renderSent()}
              {activeTab === 'accepted' && renderAccepted()}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Interests;
