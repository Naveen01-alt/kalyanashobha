import React, { useState, useEffect } from "react";
import { Check, X, Eye, Clock, ArrowRight } from "lucide-react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Ensure you have the CSS file created as described previously
import "./InterestApprovals.css"; 

export default function InterestApprovals() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("PendingPaymentVerification"); 
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch Data
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(
        `https://kalyanashobha-back.vercel.app/api/admin/interest/requests?status=${activeTab}`,
        { headers: { Authorization: token } }
      );
      if (response.data.success) {
        setRequests(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching interests", error);
      toast.error("Failed to load requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [activeTab]);

  // --- THE CORE LOGIC: ONE CLICK -> TWO API CALLS ---
  const handleFullApproval = async (paymentId, interestId) => {
    // 1. Start Loading Toast
    const toastId = toast.loading("Verifying payment and approving content...");

    const token = localStorage.getItem("adminToken");
    const headers = { Authorization: token };

    try {
      // STEP 1: Verify Payment
      await axios.post(
        "https://kalyanashobha-back.vercel.app/api/admin/payment/interest/verify",
        { paymentId, action: "approve" },
        { headers }
      );

      // STEP 2: Approve Content (Only runs if Step 1 succeeds)
      if (interestId) {
        await axios.post(
          "https://kalyanashobha-back.vercel.app/api/admin/interest/approve-content",
          { interestId, action: "approve" },
          { headers }
        );
      }

      // 2. Update Toast to Success
      toast.update(toastId, { 
        render: "Success! Interest forwarded to user.", 
        type: "success", 
        isLoading: false, 
        autoClose: 3000 
      });

      fetchRequests(); // Refresh List
      window.dispatchEvent(new Event("interestUpdated")); // Update Sidebar Badge

    } catch (error) {
      console.error(error);
      // 3. Update Toast to Error
      toast.update(toastId, { 
        render: "Error processing request.", 
        type: "error", 
        isLoading: false, 
        autoClose: 3000 
      });
    }
  };

  const handleRejection = async (paymentId) => {
    // 1. Start Loading Toast
    const toastId = toast.loading("Rejecting request...");

    try {
      const token = localStorage.getItem("adminToken");
      await axios.post(
        "https://kalyanashobha-back.vercel.app/api/admin/payment/interest/verify",
        { paymentId, action: "reject" },
        { headers: { Authorization: token } }
      );

      // 2. Update Toast to Success
      toast.update(toastId, { 
        render: "Request rejected successfully", 
        type: "success", 
        isLoading: false, 
        autoClose: 3000 
      });

      fetchRequests();
      window.dispatchEvent(new Event("interestUpdated"));
    } catch (error) {
      // 3. Update Toast to Error
      toast.update(toastId, { 
        render: "Rejection failed", 
        type: "error", 
        isLoading: false, 
        autoClose: 3000 
      });
    }
  };

  return (
    <div className="ra-container">
      {/* Toast Container */}
      <ToastContainer position="top-right" theme="colored" />

      <div className="ra-header">
        <h2>Interest Request Approvals</h2>
        <p>Verify payment proofs and forward interest requests to users.</p>
      </div>

      {/* TABS */}
      <div className="ra-tabs">
        <button 
          className={activeTab === "PendingPaymentVerification" ? "active" : ""} 
          onClick={() => setActiveTab("PendingPaymentVerification")}
        >
          Pending <span className="badge-count">Queue</span>
        </button>
        
        <button 
          className={activeTab === "Success" ? "active" : ""} 
          onClick={() => setActiveTab("Success")}
        >
          Approved History
        </button>

        <button 
          className={activeTab === "Rejected" ? "active" : ""} 
          onClick={() => setActiveTab("Rejected")}
        >
          Rejected
        </button>
      </div>

      {/* TABLE */}
      <div className="ra-table-wrapper">
        {loading ? (
          <div className="loading">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="no-data">No records found for {activeTab}.</div>
        ) : (
          <table className="ra-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Flow (Sender → Receiver)</th>
                <th>Payment</th>
                <th>Proof</th>
                <th>Status</th>
                {activeTab === "PendingPaymentVerification" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id}>
                  <td>
                    <div className="date-cell">
                      <Clock size={14} />
                      {new Date(req.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <div className="flow-cell" style={{display:'flex', alignItems:'center', gap:'10px'}}>
                      <div className="user-mini">
                         <strong>{req.sender?.firstName}</strong><br/>
                         <small>{req.sender?.uniqueId}</small>
                      </div>
                      <ArrowRight size={16} color="#888" />
                      <div className="user-mini">
                         <strong>{req.receiver?.firstName}</strong><br/>
                         <small>{req.receiver?.uniqueId}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="amount-info">
                      Rs. {req.amount}
                    </div>
                  </td>
                  <td>
                    <div className="proof-info">
                      <span className="utr">UTR: {req.utrNumber}</span>
                      <button 
                        className="view-btn" 
                        onClick={() => setSelectedImage(req.screenshotUrl)}
                      >
                        <Eye size={14} /> Check
                      </button>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${req.status}`}>
                      {req.status === 'PendingPaymentVerification' ? 'Review Needed' : req.status}
                    </span>
                  </td>
                  
                  {/* Only show Action Buttons if we are in the Pending Tab */}
                  {activeTab === "PendingPaymentVerification" && (
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-approve" 
                          onClick={() => handleFullApproval(req._id, req.interestId)}
                          title="Verify Payment & Approve Content"
                        >
                          <Check size={18} /> Approve
                        </button>
                        <button 
                          className="btn-reject" 
                          onClick={() => handleRejection(req._id)}
                          title="Reject"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* IMAGE MODAL */}
      {selectedImage && (
        <div className="ra-modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="ra-modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Proof" />
            <button className="close-modal" onClick={() => setSelectedImage(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
