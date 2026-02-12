import React, { useState, useEffect } from 'react';
import "./Payments.css";
import Navbar from "../../Components/Navbar.jsx";

const Payments = () => {
  const [activeTab, setActiveTab] = useState('membership'); 
  const [history, setHistory] = useState({ membership: [], interest: [] });
  const [loading, setLoading] = useState(false);

  const API_BASE = "https://kalyanashobha-back.vercel.app/api";

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/user/payment-history`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token 
        }
      });
      const data = await res.json();
      if (data.success) {
        setHistory({
          membership: data.membershipHistory || [],
          interest: data.interestHistory || []
        });
      }
    } catch (err) {
      console.error("Network Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const currentList = activeTab === 'membership' ? history.membership : history.interest;

  const getStatusType = (status) => {
    const s = status ? status.toLowerCase() : 'pending';
    if (['success', 'approved', 'paid', 'completed'].includes(s)) return 'success';
    if (['failed', 'rejected', 'cancelled'].includes(s)) return 'failed';
    return 'pending';
  };

  return (
    <>
      <Navbar/>

    <div className="pay-dashboard">
      
      {/* Header */}
      <div className="pay-header">
        <h2 className="pay-title">Transactions</h2>
        <div className="pay-tabs">
          <button 
            className={`tab-item ${activeTab === 'membership' ? 'active' : ''}`} 
            onClick={() => setActiveTab('membership')}
          >
            Membership
          </button>
          <button 
            className={`tab-item ${activeTab === 'interest' ? 'active' : ''}`} 
            onClick={() => setActiveTab('interest')}
          >
            Interest Requests
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="pay-content">
        
        {/* Desktop Header Row (Hidden on Mobile via CSS) */}
        <div className="pay-row header-row">
          <div className="col col-date">Date</div>
          <div className="col col-amount">Amount</div>
          <div className="col col-ref">Reference ID</div>
          {activeTab === 'interest' && <div className="col col-user">Recipient</div>}
          <div className="col col-status">Status</div>
        </div>

        {/* Rows */}
        {loading ? (
          <div className="pay-empty">Syncing data...</div>
        ) : currentList.length > 0 ? (
          currentList.map((pay) => (
            <div key={pay._id} className="pay-row data-row">
              
              {/* Date */}
              <div className="col col-date" data-label="Date">
                <div className="cell-wrap">
                  <div className="text-primary">
                    {pay.date ? new Date(pay.date).toLocaleDateString('en-IN', { 
                      day: 'numeric', month: 'short', year: 'numeric'
                    }) : '-'}
                  </div>
                  <div className="text-secondary time-text">
                    {pay.date ? new Date(pay.date).toLocaleTimeString('en-IN', { 
                      hour: '2-digit', minute:'2-digit'
                    }) : ''}
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div className="col col-amount" data-label="Amount">
                <div className="cell-wrap">
                  <span className="amount-text">
                    ₹{parseFloat(pay.amount).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Reference */}
              <div className="col col-ref" data-label="Reference ID">
                <div className="cell-wrap">
                  <span className="ref-badge">{pay.utrNumber || 'N/A'}</span>
                </div>
              </div>

              {/* Recipient */}
              {activeTab === 'interest' && (
                <div className="col col-user" data-label="Recipient">
                  <div className="cell-wrap">
                    <span className="text-primary">{pay.receiverId?.firstName || "Unknown"}</span>
                  </div>
                </div>
              )}

              {/* Status */}
              <div className="col col-status" data-label="Status">
                <div className="cell-wrap">
                  <span className={`status-pill ${getStatusType(pay.status)}`}>
                    {pay.status || 'Pending'}
                  </span>
                </div>
              </div>

            </div>
          ))
        ) : (
          <div className="pay-empty">No transactions found.</div>
        )}
      </div>
    </div>
        </>
  );
};

export default Payments;
