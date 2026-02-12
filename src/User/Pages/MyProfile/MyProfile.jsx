import React, { useState, useEffect } from 'react';
import './MyProfile.css'; 
import Navbar from "../../Components/Navbar.jsx";

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  const API_BASE = "https://kalyanashobha-back.vercel.app/api/user";

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/my-profile`, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token 
        }
      });
      
      const data = await res.json();
      
      if (data.success) {
        setUser(data.user);
        setFormData(data.user);
      }
    } catch (err) {
      console.error("Profile Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch(`${API_BASE}/update-profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token 
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (data.success) {
        setUser(data.user);
        setIsEditing(false);
        alert("Profile updated successfully");
      } else {
        alert("Update failed: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      alert("Network error occurred");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  // Helper for Section Headings
  const SectionHeader = ({ title }) => (
    <div style={{ gridColumn: '1 / -1', marginTop: '20px', marginBottom: '10px' }}>
      <h4 className="section-title">{title}</h4>
    </div>
  );

  return (
    <>
      <Navbar/>

      {loading ? (
        /* --- CORPORATE LOADING STATE --- */
        <div className="loading-container">
           <div className="spinner-box">
             <div className="corporate-spinner"></div>
           </div>
           <p className="loading-text"> Processing...</p>
        </div>
      ) : (
        /* --- MAIN PROFILE CONTENT --- */
        <div className="profile-container fade-in">
          {/* Header */}
          <div className="profile-header">
            <h2>My Profile</h2>
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="btn-edit">
                Edit Details
              </button>
            )}
          </div>

          {/* Content Area */}
          {!isEditing ? (
            <div className="profile-content">
              {/* Left Column: Avatar & Identity */}
              <div className="profile-sidebar">
                <img 
                  src={user?.photos?.[0] || "https://via.placeholder.com/150"} 
                  alt="Profile" 
                  className="avatar-large" 
                />
                <h3 className="user-name">{user?.firstName} {user?.lastName}</h3>
                <span className="user-id">ID: {user?.uniqueId || 'N/A'}</span>
                
                {/* Status Badges */}
                <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                  {user?.isPaidMember && (
                    <span className="status-badge success" style={{ fontSize: '11px' }}>Premium Member</span>
                  )}
                  {user?.isEmailVerified && (
                    <span className="status-badge approved" style={{ fontSize: '11px' }}>Verified Email</span>
                  )}
                </div>
              </div>

              {/* Right Column: Grid Details */}
              <div className="profile-details">
                
                {/* 1. Basic Information */}
                <SectionHeader title="Basic Information" />
                <div className="detail-group">
                  <label>Age / DOB</label>
                  <div>{calculateAge(user?.dob)} Years ({new Date(user?.dob).toLocaleDateString()})</div>
                </div>
                <div className="detail-group">
                  <label>Gender</label>
                  <div>{user?.gender || "N/A"}</div>
                </div>
                <div className="detail-group">
                  <label>Height</label>
                  <div>{user?.height} cm</div>
                </div>
                <div className="detail-group">
                  <label>Marital Status</label>
                  <div>{user?.maritalStatus || "N/A"}</div>
                </div>

                {/* 2. Cultural & Religious */}
                <SectionHeader title="Cultural Background" />
                <div className="detail-group">
                  <label>Religion</label>
                  <div>{user?.religion || "N/A"}</div>
                </div>
                <div className="detail-group">
                  <label>Community</label>
                  <div>{user?.community || "N/A"}</div>
                </div>
                <div className="detail-group">
                  <label>Caste / Sub-Community</label>
                  <div>{user?.caste} {user?.subCommunity && `(${user?.subCommunity})`}</div>
                </div>
                <div className="detail-group">
                  <label>Diet</label>
                  <div>{user?.diet || "N/A"}</div>
                </div>

                {/* 3. Education & Career */}
                <SectionHeader title="Education & Career" />
                <div className="detail-group">
                  <label>Highest Qualification</label>
                  <div>{user?.highestQualification || "N/A"}</div>
                </div>
                <div className="detail-group">
                  <label>College Name</label>
                  <div>{user?.collegeName || "N/A"}</div>
                </div>
                <div className="detail-group">
                  <label>Work Type</label>
                  <div>{user?.workType || "N/A"}</div>
                </div>
                <div className="detail-group">
                  <label>Job Role</label>
                  <div>{user?.jobRole || "N/A"}</div>
                </div>
                <div className="detail-group">
                  <label>Company</label>
                  <div>{user?.companyName || "N/A"}</div>
                </div>
                <div className="detail-group">
                  <label>Annual Income</label>
                  <div>{user?.annualIncome || "N/A"}</div>
                </div>

                {/* 4. Location & Contact */}
                <SectionHeader title="Location & Contact" />
                <div className="detail-group">
                  <label>Current Location</label>
                  <div>{user?.city}, {user?.state}, {user?.country}</div>
                </div>
                <div className="detail-group">
                  <label>Email</label>
                  <div style={{ wordBreak: 'break-all' }}>{user?.email}</div>
                </div>
                <div className="detail-group">
                  <label>Mobile</label>
                  <div>{user?.mobileNumber}</div>
                </div>

                {/* 5. About */}
                <SectionHeader title="About Me" />
                <div className="detail-group" style={{ gridColumn: '1 / -1' }}>
                  <div style={{ lineHeight: '1.6', color: '#4f566b', fontSize: '14px' }}>
                    {user?.aboutMe || "No description provided."}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* --- EDIT MODE FORM --- */
            <form onSubmit={handleUpdate} className="profile-form">
              <SectionHeader title="Edit Basic Details" />
              <div className="form-group">
                <label>Marital Status</label>
                <select name="maritalStatus" value={formData.maritalStatus || ''} onChange={handleChange}>
                  <option value="Never Married">Never Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Awaiting Divorce">Awaiting Divorce</option>
                </select>
              </div>
              <div className="form-group">
                <label>Height (cm)</label>
                <input name="height" type="number" value={formData.height || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Diet</label>
                <select name="diet" value={formData.diet || ''} onChange={handleChange}>
                  <option value="Veg">Veg</option>
                  <option value="Non-Veg">Non-Veg</option>
                  <option value="Eggetarian">Eggetarian</option>
                </select>
              </div>

              <SectionHeader title="Edit Education & Career" />
              <div className="form-group">
                <label>Highest Qualification</label>
                <input name="highestQualification" value={formData.highestQualification || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>College Name</label>
                <input name="collegeName" value={formData.collegeName || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Work Type</label>
                <select name="workType" value={formData.workType || ''} onChange={handleChange}>
                  <option value="Private">Private</option>
                  <option value="Government">Government</option>
                  <option value="Business">Business</option>
                  <option value="Self Employed">Self Employed</option>
                </select>
              </div>
              <div className="form-group">
                <label>Job Role</label>
                <input name="jobRole" value={formData.jobRole || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Company Name</label>
                <input name="companyName" value={formData.companyName || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Annual Income</label>
                <input name="annualIncome" value={formData.annualIncome || ''} onChange={handleChange} />
              </div>

              <SectionHeader title="Edit Location" />
              <div className="form-group">
                <label>City</label>
                <input name="city" value={formData.city || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>State</label>
                <input name="state" value={formData.state || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input name="country" value={formData.country || ''} onChange={handleChange} />
              </div>

              <SectionHeader title="About Me" />
              <div className="form-group full-width">
                <textarea 
                  name="aboutMe" 
                  value={formData.aboutMe || ''} 
                  onChange={handleChange} 
                  rows="4"
                ></textarea>
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setIsEditing(false)} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </>
  );
};

export default MyProfile;
