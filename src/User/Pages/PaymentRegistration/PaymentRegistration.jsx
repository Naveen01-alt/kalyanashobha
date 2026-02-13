import React, { useState, useEffect } from 'react';
import Navbar from "../../Components/Navbar.jsx";
import { useNavigate } from 'react-router-dom';
import QRCode from "react-qr-code"; // Make sure to npm install react-qr-code
import './Payment.css'; 

const PaymentRegistration = () => {
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(false); // To detect device

  const [amount, setAmount] = useState('1000'); 
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshot, setScreenshot] = useState(null);

  // YOUR UPI STRING
  const upiLink = "upi://pay?pa=8897714968@axl&pn=Kalyana%20Shobha&am=1000&cu=INR"; 

  // DETECT DEVICE ON MOUNT
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      if (/android/i.test(userAgent) || /iPad|iPhone|iPod/.test(userAgent)) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };
    checkMobile();
  }, []);

  const handlePayClick = () => {
    window.location.href = upiLink;
    // Auto-advance only on mobile, since desktop users stay on screen to scan
    setTimeout(() => { setStep(2); }, 3000);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshot(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!utrNumber || !screenshot) {
      setError("Please provide both UTR Number and Payment Screenshot.");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const formData = new FormData();
      formData.append('amount', amount);
      formData.append('utrNumber', utrNumber);
      formData.append('screenshot', screenshot);

      const response = await fetch("https://kalyanashobha-back.vercel.app/api/payment/registration/submit", {
        method: 'POST',
        headers: { 'Authorization': token },
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        alert("Payment submitted successfully!");
        navigate('/dashboard'); 
      } else {
        setError(data.message || "Submission failed.");
      }
    } catch (err) {
      setError("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="checkout-wrapper">
        <div className="checkout-grid">
          
          {/* LEFT COLUMN: PRODUCT SUMMARY */}
          <div className="product-summary">
            <div className="summary-header">
              <span className="brand-label">Kalyana Shobha</span>
              <h2>Premium Membership</h2>
              <div className="price-tag">
                <span className="currency">₹</span>
                <span className="amount">1,000</span>
              </div>
            </div>

            <div className="features-list">
              <div className="feature-item">
                <div className="check-icon">✓</div>
                <div className="feature-text">
                  <strong>Verified Badge</strong>
                  <p>Build trust with a verified profile status.</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="check-icon">✓</div>
                <div className="feature-text">
                  <strong>Profile Access</strong>
                  <p>Browse more profiles & contact details.</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="check-icon">✓</div>
                <div className="feature-text">
                  <strong>Profile Activation</strong>
                  <p>Make your profile visible to others.</p>
                </div>
              </div>
            </div>
            
            <div className="secure-badge">
              🔒 SSL Encrypted & Secure Payment
            </div>
          </div>

          {/* RIGHT COLUMN: ACTION AREA */}
          <div className="payment-action-area">
            
            {/* STEP 1: SELECT PAYMENT */}
            {step === 1 && (
              <div className="action-content fade-in">
                <h3>Select Payment Method</h3>
                <p className="step-desc">
                  {isMobile ? "Pay securely via any UPI App" : "Scan QR code with your phone"}
                </p>
                
                {/* --- DYNAMIC PAYMENT UI --- */}
                {isMobile ? (
                  // MOBILE VIEW: BUTTON
                  <>
                    <div className="method-box selected">
                      <div className="radio-circle"></div>
                      <span className="method-name">UPI App (GPay/PhonePe)</span>
                      <img src="https://cdn-icons-png.flaticon.com/512/2704/2704332.png" className="upi-icon" alt="UPI"/>
                    </div>
                    <button className="stripe-btn" onClick={handlePayClick}>
                      Pay ₹1,000 Now
                    </button>
                  </>
                ) : (
                  // PC VIEW: QR CODE
                  <div className="qr-container">
                    <div className="qr-box">
                       {/* Generates QR from UPI Link */}
                       <QRCode value={upiLink} size={160} />
                    </div>
                    <p className="qr-text">Scan with GPay, PhonePe, or Paytm</p>
                    <div className="divider"><span>OR</span></div>
                    <p className="manual-upi">UPI ID: <strong>8897714968@axl</strong></p>
                  </div>
                )}
                {/* ------------------------- */}

                <div className="manual-link-area">
                  <p>Payment Completed?</p>
                  <button className="text-link" onClick={() => setStep(2)}>
                    Enter Transaction Details &rarr;
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: FORM UI */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="action-content fade-in">
                <h3>Verify Transaction</h3>
                <p className="step-desc">Provide proof to activate your account.</p>

                <div className="corp-input-group">
                  <label>UTR / Reference ID</label>
                  <input 
                    type="text" 
                    value={utrNumber} 
                    onChange={(e) => setUtrNumber(e.target.value)}
                    placeholder="e.g. 123456789012"
                    required
                  />
                </div>

                <div className="corp-input-group">
                  <label>Screenshot Proof</label>
                  <div className="file-drop-area">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                    />
                    <span className="file-msg">
                      {screenshot ? screenshot.name : "Click to Upload Image"}
                    </span>
                  </div>
                </div>

                {error && <div className="error-msg">{error}</div>}

                <div className="btn-group">
                  <button type="button" className="back-btn" onClick={() => setStep(1)}>Back</button>
                  <button type="submit" className="stripe-btn" disabled={loading}>
                    {loading ? "Verifying..." : "Submit Verification"}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentRegistration;
