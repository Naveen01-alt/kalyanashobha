import React, { useState, useEffect } from "react";
import { Check, X, Eye, Clock } from "lucide-react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Simple CSS for the modal and table
import "./RegistrationApprovals.css"; 

export default function RegistrationApprovals() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("PendingVerification"); // Default Tab
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch Data
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(
        `https://kalyanashobha-back.vercel.app/api/admin/payment/registrations?status=${activeTab}`,
        { headers: { Authorization: token } }
      );
      if (response.data.success) {
        setPayments(response.data.payments);
      }
    } catch (error) {
      console.error("Error fetching payments", error);
      toast.error("Failed to load records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [activeTab]);

  // Handle Approve/Reject with Toast Loading State
  const handleAction = async (paymentId, action) => {
    // 1. Start the loading toast
    const toastId = toast.loading(`Processing ${action}...`);

    try {
      const token = localStorage.getItem("adminToken");
      await axios.post(
        "https://kalyanashobha-back.vercel.app/api/admin/payment/registration/verify",
        { paymentId, action }, // action: 'approve' or 'reject'
        { headers: { Authorization: token } }
      );

      // 2. On Success: Update the toast
      toast.update(toastId, { 
        render: `Payment ${action}ed successfully`, 
        type: "success", 
        isLoading: false, 
        autoClose: 3000 
      });

      // 3. Refresh list
      fetchPayments();
      
      // Optional: Trigger a global event to update sidebar count
      window.dispatchEvent(new Event("paymentUpdated"));

    } catch (error) {
      // 4. On Error: Update the toast
      toast.update(toastId, { 
        render: "Action failed. Please try again.", 
        type: "error", 
        isLoading: false, 
        autoClose: 3000 
      });
    }
  };

  return (
    <div className="ra-container">
      {/* Toast Container for notifications */}
      <ToastContainer position="top-right" theme="colored" />

      <div className="ra-header">
        <h2>Registration Approvals</h2>
        <p>Verify membership payments and activate users.</p>
      </div>

      {/* TABS */}
      <div className="ra-tabs">
        <button 
          className={activeTab === "PendingVerification" ? "active" : ""} 
          onClick={() => setActiveTab("PendingVerification")}
        >
          Pending <span className="badge-count">Waitlist</span>
        </button>
        <button 
          className={activeTab === "Success" ? "active" : ""} 
          onClick={() => setActiveTab("Success")}
        >
          Accepted
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
          <div className="loading">Loading records...</div>
        ) : payments.length === 0 ? (
          <div className="no-data">No records found for {activeTab}.</div>
        ) : (
          <table className="ra-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>User Details</th>
                <th>Payment Info</th>
                <th>Proof (UTR & Screen)</th>
                <th>Status</th>
                {activeTab === "PendingVerification" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {payments.map((pay) => (
                <tr key={pay._id}>
                  <td>
                    <div className="date-cell">
                      <Clock size={14} />
                      {new Date(pay.date).toLocaleDateString()}
                      <small>{new Date(pay.date).toLocaleTimeString()}</small>
                    </div>
                  </td>
                  <td>
                    <div className="user-info">
                      <strong>{pay.userId?.firstName} {pay.userId?.lastName}</strong>
                      <span>ID: {pay.userId?.uniqueId}</span>
                      <span>{pay.userId?.mobileNumber}</span>
                    </div>
                  </td>
                  <td>
                    <div className="amount-info">
                      Rs. {pay.amount}
                    </div>
                  </td>
                  <td>
                    <div className="proof-info">
                      <span className="utr">UTR: {pay.utrNumber}</span>
                      <button 
                        className="view-btn" 
                        onClick={() => setSelectedImage(pay.screenshotUrl)}
                      >
                        <Eye size={14} /> View Screenshot
                      </button>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${pay.status}`}>
                      {pay.status}
                    </span>
                  </td>
                  {activeTab === "PendingVerification" && (
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-approve" 
                          onClick={() => handleAction(pay._id, "approve")}
                          title="Approve"
                        >
                          <Check size={18} />
                        </button>
                        <button 
                          className="btn-reject" 
                          onClick={() => handleAction(pay._id, "reject")}
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
