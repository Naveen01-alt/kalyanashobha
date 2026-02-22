import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import SignatureCanvas from 'react-signature-canvas';
import './Registration.css';
import Navbar from "../../Components/Navbar.jsx";

const DATA = {
  RELIGIONS: ["Hindu", "Muslim", "Christian", "Sikh", "Jain", "Buddhist", "Parsi", "Other"],
  COMMUNITY: ["Hindu", "Telugu","English", "Tamil", "kannada", "Malayalam", "Marathi", "Bengali", "Gujarathi", "Punjabi", "Oriya", " Assamese", "Others"],
 SUBCASTE: ["Brahmin", "Kshatriya", "Vaishya", "Shudra", "Dalit", "Tribal", "Iyer", "Iyengar", "Rajput", "Kayastha", "Bania", "Jat", "Maratha", "Patel", "Reddy", "Kamma", "Kapu", "Balija", "Vokkaliga", "Lingayat", "Nair", "Menon", "Ezhava", "Chettiar", "Vanniyar", "Yadav", "Goud", "Mudiraj", "Padmasali", "Mala", "Madiga", "SC", "ST", "Sikh-Jat", "Sikh-Ramgharia", "Sunni", "Shia", "Catholic", "Protestant", "Other"],
 DIETS: ["Veg", "Non-Veg", "Eggetarian", "Jain", "Vegan"],
  COUNTRIES: ["India", "USA", "UK", "Canada", "Australia", "UAE"],
  INCOMES: ["No Income", "INR 0 - 1 Lakh", "INR 1-2 Lakh", "INR 2-4 Lakh", "INR 4-7 Lakh", "INR 7-10 Lakh", "INR 10 Lakh+"],
  WORK_TYPES: ["Private Company", "Government / PSU", "Business / Self Employed", "Defence", "Not Working"],
  HEIGHTS: Array.from({ length: 24 }, (_, i) => {
    const totalInches = 53 + i; 
    const ft = Math.floor(totalInches / 12);
    const inch = totalInches % 12;
    const cm = Math.round(totalInches * 2.54);
    return `${ft}ft ${inch}in (${cm}cm)`;
  }),
  STAGES: ["Account", "Personal", "Professional"]
};

const Register = () => {
  const [stage, setStage] = useState(1);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const sigRef = useRef(null);

  const [formData, setFormData] = useState({
    profileFor: 'Myself', gender: 'Male', firstName: '', lastName: '', 
    email: '', password: '', mobileNumber: '',
    dobDay: '', dobMonth: '', dobYear: '', religion: '', community: '', 
    caste: '', height: '', maritalStatus: 'Never Married', diet: '',
    country: 'India', state: '',
    qualification: '', instituteName: '', annualIncome: '', 
    workType: '', jobRole: '', termsAccepted: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'mobileNumber') {
      const val = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: val }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateStage = () => {
    let newErrors = {};
    if (stage === 1) {
      if (!formData.firstName) newErrors.firstName = "Required";
      if (!formData.lastName) newErrors.lastName = "Required";
      if (!formData.email.includes('@')) newErrors.email = "Invalid Email";
      if (formData.password.length < 6) newErrors.password = "Min 6 chars";
      if (formData.mobileNumber.length !== 10) newErrors.mobileNumber = "10 Digits Required";
    } else if (stage === 2) {
      if (!formData.dobDay || !formData.dobYear) newErrors.dob = "Required";
      if (!formData.religion) newErrors.religion = "Required";
      if (!formData.diet) newErrors.diet = "Required";
      if (!formData.state) newErrors.state = "Required";
      if (!formData.height) newErrors.height = "Required";
    } else if (stage === 3) {
      if (!formData.qualification) newErrors.qualification = "Required";
      if (!formData.workType) newErrors.workType = "Required";
      if (!formData.jobRole) newErrors.jobRole = "Required";
      if (sigRef.current.isEmpty()) { toast.error("Please sign the document"); return false; }
      if (!formData.termsAccepted) { toast.error("Please accept T&C"); return false; }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFinalSubmit = () => {
    if (validateStage()) {
      toast.success("Registration Successful!", { duration: 2000, icon: '🚀' });
      setTimeout(() => { navigate('/login'); }, 2000);
    } else {
      toast.error("Complete all required fields");
    }
  };

  const next = () => validateStage() ? setStage(stage + 1) : toast.error("Missing Fields");

  return (
    <div className="reg-page-wrapper">
      <Navbar />
      <Toaster position="top-center" />
      <div className="reg-card">
        <div className="stage-indicator">
          {DATA.STAGES.map((label, idx) => (
            <div key={label} className={`stage-dot ${stage >= idx + 1 ? 'active' : ''}`}>
              <span className="dot-label">{label}</span>
            </div>
          ))}
          <div className="progress-line" style={{ width: `${(stage - 1) * 50}%` }}></div>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          {stage === 1 && (
            <div className="stage-container slide-in">
              <h2 className="stage-title">Account Creation</h2>
              
              <label className="section-label">Profile Created For</label>
              <div className="bubble-grid">
                {['Myself', 'My Brother', 'My Sister', 'My Friend', 'My Relative'].map(opt => (
                  <button key={opt} type="button" className={`bubble-btn ${formData.profileFor === opt ? 'active' : ''}`} onClick={() => setFormData({...formData, profileFor: opt})}>{opt}</button>
                ))}
              </div>

              <label className="section-label">Gender</label>
              <div className="bubble-grid">
                {['Male', 'Female'].map(g => (
                  <button key={g} type="button" className={`bubble-btn ${formData.gender === g ? 'active' : ''}`} onClick={() => setFormData({...formData, gender: g})}>{g}</button>
                ))}
              </div>

              <label className="field-hint">First Name {errors.firstName && <span className="err-pop">{errors.firstName}</span>}</label>
              <input className="modern-input" name="firstName" value={formData.firstName} onChange={handleChange} />

              <label className="field-hint">Last Name {errors.lastName && <span className="err-pop">{errors.lastName}</span>}</label>
              <input className="modern-input" name="lastName" value={formData.lastName} onChange={handleChange} />

              <label className="field-hint">Phone (10 digits) {errors.mobileNumber && <span className="err-pop">{errors.mobileNumber}</span>}</label>
              <input className="modern-input" name="mobileNumber" value={formData.mobileNumber} placeholder="Only numbers allowed" onChange={handleChange} />

              <label className="field-hint">Email {errors.email && <span className="err-pop">{errors.email}</span>}</label>
              <input className="modern-input" name="email" onChange={handleChange} />

              <label className="field-hint">Password {errors.password && <span className="err-pop">{errors.password}</span>}</label>
              <input className="modern-input" name="password" type="password" placeholder="Min 6 characters" onChange={handleChange} />
            </div>
          )}

          {stage === 2 && (
            <div className="stage-container slide-in">
              <h2 className="stage-title">Bio & Location</h2>
              <label className="field-hint">Date of Birth {errors.dob && <span className="err-pop">{errors.dob}</span>}</label>
              <div className="dob-grid">
                <input className="modern-input" name="dobDay" placeholder="DD" onChange={handleChange} />
                <input className="modern-input" name="dobMonth" placeholder="MM" onChange={handleChange} />
                <input className="modern-input" name="dobYear" placeholder="YYYY" onChange={handleChange} />
              </div>

              <div className="dual-input">
                <div className="input-wrap">
                  <label className="field-hint">Religion {errors.religion && <span className="err-pop">{errors.religion}</span>}</label>
                  <select className="modern-input" name="religion" onChange={handleChange}>
                    <option value="">Select</option>
                    {DATA.RELIGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="input-wrap">
                  <label className="field-hint">Community {errors.religion && <span className="err-pop">{errors.community}</span>}</label>
                  <select className="modern-input" name="community" onChange={handleChange}>
                    <option value="">Select</option>
                    {DATA.COMMUNITY.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  </div>
                <div className="input-wrap">
                  <label className="field-hint">Diet {errors.diet && <span className="err-pop">{errors.diet}</span>}</label>
                  <select className="modern-input" name="diet" onChange={handleChange}>
                    <option value="">Select</option>
                    {DATA.DIETS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="input-wrap">
                  <label className="field-hint">Sub-Caste {errors.religion && <span className="err-pop">{errors.subcaste}</span>}</label>
                  <select className="modern-input" name="community" onChange={handleChange}>
                    <option value="">Select</option>
                    {DATA.SUBCASTE.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  </div>
              </div>

              <label className="field-hint">Country</label>
              <select className="modern-input" name="country" value={formData.country} onChange={handleChange}>
                {DATA.COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <div className="dual-input">
                <div className="input-wrap">
                  <label className="field-hint">State {errors.state && <span className="err-pop">{errors.state}</span>}</label>
                  <input className="modern-input" name="state" placeholder="e.g. Maharashtra" onChange={handleChange} />
                </div>
                <div className="input-wrap">
                  <label className="field-hint">Height {errors.height && <span className="err-pop">{errors.height}</span>}</label>
                  <select className="modern-input" name="height" onChange={handleChange}>
                    <option value="">Select</option>
                    {DATA.HEIGHTS.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {stage === 3 && (
            <div className="stage-container slide-in">
              <h2 className="stage-title">Professional Life</h2>
              <label className="field-hint">Highest Qualification {errors.qualification && <span className="err-pop">{errors.qualification}</span>}</label>
              <input className="modern-input" name="qualification" onChange={handleChange} />

              <label className="field-hint">College / Institute</label>
              <input className="modern-input" name="instituteName" onChange={handleChange} />

              <label className="field-hint">Work Type {errors.workType && <span className="err-pop">{errors.workType}</span>}</label>
              <select className="modern-input" name="workType" onChange={handleChange}>
                <option value="">Select</option>
                {DATA.WORK_TYPES.map(w => <option key={w} value={w}>{w}</option>)}
              </select>

              <label className="field-hint">Job Role {errors.jobRole && <span className="err-pop">{errors.jobRole}</span>}</label>
              <input className="modern-input" name="jobRole" placeholder="Designation" onChange={handleChange} />

              <label className="field-hint">Annual Income</label>
              <select className="modern-input" name="annualIncome" onChange={handleChange}>
                <option value="">Select Range</option>
                {DATA.INCOMES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>

              <div className="verification-box">
                <label className="section-label">Digital Signature</label>
                <div className="sig-wrapper">
                  <SignatureCanvas ref={sigRef} penColor="black" canvasProps={{ className: 'sigCanvas' }} />
                </div>
                <button type="button" className="clear-link" onClick={() => sigRef.current.clear()}>Reset</button>
              </div>

              <div className="consent-check">
                <input type="checkbox" id="t-c" onChange={(e) => setFormData({...formData, termsAccepted: e.target.checked})} />
                <label htmlFor="t-c">I confirm details are correct</label>
              </div>
            </div>
          )}

          <div className="nav-actions">
            {stage > 1 && <button type="button" className="btn-secondary" onClick={() => setStage(stage - 1)}>Back</button>}
            <button type="button" className="btn-primary" onClick={stage < 3 ? next : handleFinalSubmit}>
              {stage === 3 ? "Register" : "Continue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;