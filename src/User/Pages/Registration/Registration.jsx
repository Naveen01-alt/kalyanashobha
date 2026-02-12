import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom'; 
import toast, { Toaster } from 'react-hot-toast'; // Imported Toast
import './Registration.css';
import Navbar from "../../Components/Navbar.jsx";

// --- DATA CONSTANTS ---
const RELIGIONS = ["Hindu", "Muslim", "Christian", "Sikh", "Jain", "Buddhist", "Parsi", "Jewish", "Spiritual - No Religion", "Other"];
const COMMUNITIES = ["Hindi", "Telugu", "Tamil", "Kannada", "Malayalam", "Marathi", "Bengali", "Gujarati", "Punjabi", "Urdu", "Odia", "Assamese", "Marwari", "Bhojpuri", "Konkani", "Sindhi", "English"];
const COUNTRIES = ["India", "United States", "United Kingdom", "Canada", "Australia", "UAE", "Singapore", "Germany", "New Zealand", "Malaysia", "Saudi Arabia", "Kuwait", "Others"];
const STATES = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi NCR", "Jammu & Kashmir"];
const CITIES = ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Bangalore", "Mysore", "Mangalore", "Chennai", "Coimbatore", "Madurai", "Mumbai", "Pune", "Nagpur", "Delhi", "Noida", "Gurgaon", "Kolkata", "Ahmedabad", "Surat", "Jaipur", "Lucknow", "Patna", "Bhopal", "Indore", "Chandigarh", "Kochi", "Thiruvananthapuram"];
const SUB_COMMUNITIES = ["Brahmin", "Reddy", "Kamma", "Kapu", "Kshatriya", "Vaishya", "Balija", "Goud", "Yadav", "Mudiraj", "Mala", "Madiga", "SC", "ST", "Padmasali", "Vokkaliga", "Lingayat", "Nair", "Menon", "Ezhava", "Iyer", "Iyengar", "Chettiar", "Vanniyar", "Maratha", "Patel", "Bania", "Kayastha", "Rajput", "Jat", "Sikh - Jat", "Sikh - Ramgharia", "Sunni", "Shia", "Catholic", "Protestant", "Don't wish to specify"];
const HEIGHTS = ["4ft 5in (134cm)", "4ft 6in (137cm)", "4ft 7in (139cm)", "4ft 8in (142cm)", "4ft 9in (144cm)", "5ft 0in (152cm)", "5ft 1in (154cm)", "5ft 2in (157cm)", "5ft 3in (160cm)", "5ft 4in (162cm)", "5ft 5in (165cm)", "5ft 6in (167cm)", "5ft 7in (170cm)", "5ft 8in (172cm)", "5ft 9in (175cm)", "5ft 10in (177cm)", "5ft 11in (180cm)", "6ft 0in (182cm)", "6ft 1in (185cm)", "6ft 2in (187cm)", "6ft 3in (190cm)", "6ft 4in (193cm)"];
const INCOMES = ["No Income", "INR 0 - 1 Lakh", "INR 1 Lakh - 2 Lakh", "INR 2 Lakh - 4 Lakh", "INR 4 Lakh - 7 Lakh", "INR 7 Lakh - 10 Lakh", "INR 10 Lakh - 15 Lakh", "INR 15 Lakh - 20 Lakh", "INR 20 Lakh - 30 Lakh", "INR 30 Lakh - 50 Lakh", "INR 50 Lakh - 1 Crore", "INR 1 Crore+"];
const PROFESSIONS = ["Software Engineer", "Banking Professional", "Doctor", "Nurse", "Teacher / Professor", "Civil Services (IAS/IPS)", "Defence (Army/Navy/Airforce)", "Business / Entrepreneur", "Lawyer", "Architect", "Chartered Accountant", "Marketing Professional", "HR Professional", "Consultant", "Civil Engineer", "Mechanical Engineer", "Govt Employee", "Student", "Not Working"];

// --- ICONS (SVG) ---
const Icons = {
  User: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
  Heart: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>,
  Location: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>,
  Book: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>,
  Briefcase: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>,
  Mail: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>,
  ChevronDown: () => <svg className="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>,
  Eye: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>,
  EyeOff: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
};

// --- CUSTOM COMPONENTS ---
const CustomSelect = ({ label, name, value, onChange, options, error, placeholder = "Select" }) => (
  <div className={`input-group ${error ? 'has-error' : ''}`}>
    <label>{label}</label>
    <div className="select-wrapper">
      <select name={name} value={value} onChange={onChange}>
        <option value="">{placeholder}</option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt}>{opt}</option>
        ))}
      </select>
      <Icons.ChevronDown />
    </div>
    {error && <span className="error-msg">{error}</span>}
  </div>
);

const CustomInput = ({ label, name, type="text", placeholder, value, onChange, error, autoComplete }) => (
  <div className={`input-group ${error ? 'has-error' : ''}`}>
    <label>{label}</label>
    <input 
      type={type} 
      name={name} 
      value={value} 
      onChange={onChange} 
      placeholder={placeholder} 
      autoComplete={autoComplete}
    />
    {error && <span className="error-msg">{error}</span>}
  </div>
);

const Register = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false); // Added for professional password UX
  const navigate = useNavigate(); 
  
  // Extract referral parameters from the URL
  const [searchParams] = useSearchParams();
  const refId = searchParams.get('refId');
  const refName = searchParams.get('refName');
  
  const [formData, setFormData] = useState({
    profileFor: 'Myself',
    gender: 'Male',
    firstName: '',
    lastName: '',
    dobDay: '',
    dobMonth: '',
    dobYear: '',
    religion: '',
    community: '',
    country: 'India',
    email: '',
    password: '', 
    mobileNumber: '',
    state: '',
    city: '',
    subCommunity: '',
    maritalStatus: 'Never Married',
    height: '',
    diet: 'Veg',
    highestQualification: '',
    college: '',
    annualIncome: '',
    workWith: 'Private Company',
    workAs: '',
    companyName: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const selectOption = (name, value) => {
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateStep = (currentStep) => {
    let newErrors = {};
    let isValid = true;

    const require = (field, msg = "Required") => {
      if (!formData[field] || formData[field].toString().trim() === "") {
        newErrors[field] = msg;
        isValid = false;
      }
    };

    switch (currentStep) {
      case 1:
        require("profileFor");
        require("gender");
        break;
      case 2:
        require("firstName", "Enter first name");
        require("lastName", "Enter last name");
        require("dobDay");
        require("dobMonth");
        require("dobYear");
        break;
      case 3:
        require("religion");
        require("community");
        require("country");
        break;
      case 4:
        require("email", "Enter valid email");
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Invalid email format";
            isValid = false;
        }
        require("password");
        if(formData.password && formData.password.length < 6) {
             newErrors.password = "Min 6 chars";
             isValid = false;
        }
        require("mobileNumber");
        break;
      case 5:
        require("state");
        require("city");
        require("subCommunity");
        break;
      case 6:
        require("maritalStatus");
        require("height");
        require("diet");
        break;
      case 7:
        require("highestQualification");
        require("college");
        break;
      case 8:
        require("annualIncome");
        require("workWith");
        require("workAs");
        require("companyName");
        break;
      default: break;
    }

    setErrors(newErrors);
    return isValid;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      window.scrollTo(0, 0); 
    }
  };

  const prevStep = () => setStep(step - 1);

  const getBackendWorkType = (frontendValue) => {
    const map = {
      'Private Company': 'Private',
      'Government / PSU': 'Govt',
      'Business / Self Employed': 'Business', 
      'Defence': 'Govt',
      'Not Working': 'Private' 
    };
    return map[frontendValue] || 'Private';
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!validateStep(8)) return;

    setLoading(true);
    // Added a loading toast for better UX
    const toastId = toast.loading("Creating your profile..."); 

    try {
      const dobDate = new Date(`${formData.dobYear}-${formData.dobMonth}-${formData.dobDay}`);
      
      const payload = {
        ...formData,
        dob: dobDate,
        workType: getBackendWorkType(formData.workWith), 
        jobRole: formData.workAs, 
        collegeName: formData.college,
        caste: formData.subCommunity,
        height: parseInt(formData.height.match(/\d+/g)?.pop() || 0), 
      };

      if (refId) {
        payload.referredByAgentId = refId;
        payload.referralType = "link"; 
      }
      
      if (refName) {
        payload.referredByAgentName = refName;
      }

      const response = await fetch('https://kalyanashobha-back.vercel.app/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success("Registration completed! Please login with your credentials.", { id: toastId });
        
        // Delaying navigation slightly so user can read the toast, 
        // and passing email in state so the login screen can pre-fill it!
        setTimeout(() => {
            navigate('/login', { state: { savedEmail: formData.email } }); 
        }, 1500);

      } else {
        toast.error(`Error: ${data.message}`, { id: toastId });
      }
    } catch (error) {
      console.error("Registration Error:", error);
      toast.error("Something went wrong. Please try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1: 
        return (
          <div className="step-container fade-in">
            <h2 className="step-title">Welcome</h2>
            <p className="step-subtitle">Let's set up the profile.</p>
            <h3 className="section-label">This Profile is for</h3>
            <div className="chip-grid">
              {['Myself', 'My Son', 'My Daughter', 'My Brother', 'My Sister', 'My Friend'].map((opt) => (
                <button 
                    key={opt} 
                    type="button" 
                    className={`chip ${formData.profileFor === opt ? 'active' : ''}`} 
                    onClick={() => selectOption('profileFor', opt)}
                >
                    {opt}
                </button>
              ))}
            </div>
            <h3 className="section-label mt-20">Gender</h3>
            <div className="chip-grid two-col">
              {['Male', 'Female'].map((gen) => (
                <button 
                    key={gen} 
                    type="button" 
                    className={`chip ${formData.gender === gen ? 'active' : ''}`} 
                    onClick={() => selectOption('gender', gen)}
                >
                    {gen}
                </button>
              ))}
            </div>
          </div>
        );
      case 2: 
        return (
          <div className="step-container fade-in">
            <div className="step-icon"><Icons.User /></div>
            <h2 className="step-title">Basic Details</h2>
            <CustomInput label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} error={errors.firstName} placeholder="Enter First Name" />
            <CustomInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} error={errors.lastName} placeholder="Enter Last Name" />
            
            <h3 className="section-label mt-20">Date of Birth</h3>
            <div className={`dob-container ${errors.dobDay || errors.dobMonth || errors.dobYear ? 'has-error' : ''}`}>
              <input type="number" name="dobDay" placeholder="DD" value={formData.dobDay} onChange={handleChange} className="dob-input" />
              <input type="number" name="dobMonth" placeholder="MM" value={formData.dobMonth} onChange={handleChange} className="dob-input" />
              <input type="number" name="dobYear" placeholder="YYYY" value={formData.dobYear} onChange={handleChange} className="dob-input full" />
            </div>
            {(errors.dobDay || errors.dobMonth || errors.dobYear) && <span className="error-msg">Complete Date of Birth required</span>}
          </div>
        );
      case 3: 
        return (
          <div className="step-container fade-in">
            <div className="step-icon"><Icons.Location /></div>
            <h2 className="step-title">Religion & Community</h2>
            <CustomSelect label="Religion" name="religion" value={formData.religion} onChange={handleChange} error={errors.religion} options={RELIGIONS} />
            <CustomSelect label="Community / Mother Tongue" name="community" value={formData.community} onChange={handleChange} error={errors.community} options={COMMUNITIES} />
            <CustomSelect label="Living in Country" name="country" value={formData.country} onChange={handleChange} error={errors.country} options={COUNTRIES} />
          </div>
        );
      case 4: 
        return (
          <div className="step-container fade-in">
            <div className="step-icon"><Icons.Mail /></div>
            <h2 className="step-title">Contact & Security</h2>
            <div className="info-badge"><p>We do not share your contact details without your permission.</p></div>
            
            <CustomInput 
               label="Email ID" 
               name="email" 
               type="email" 
               value={formData.email} 
               onChange={handleChange} 
               error={errors.email} 
               placeholder="name@example.com"
               autoComplete="username" 
            />
            
            {/* Custom Password Input with visibility toggle */}
            <div className={`input-group ${errors.password ? 'has-error' : ''}`}>
              <label>Create Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                  style={{ width: '100%', paddingRight: '40px', boxSizing: 'border-box' }}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
                >
                  {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                </button>
              </div>
              {errors.password && <span className="error-msg">{errors.password}</span>}
            </div>
            
            <div className={`input-group ${errors.mobileNumber ? 'has-error' : ''}`}>
              <label>Mobile Number</label>
              <div className="mobile-input-wrapper">
                <span className="country-code">+91</span>
                <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} placeholder="98765 43210" />
              </div>
               {errors.mobileNumber && <span className="error-msg">{errors.mobileNumber}</span>}
            </div>
          </div>
        );
      case 5: 
      // ... [Keep Cases 5 through 8 exactly as they were in your code]
        return (
          <div className="step-container fade-in">
             <div className="step-icon"><Icons.Location /></div>
             <h2 className="step-title">Current Location</h2>
            <CustomSelect label="State" name="state" value={formData.state} onChange={handleChange} error={errors.state} options={STATES} />
            <CustomSelect label="City" name="city" value={formData.city} onChange={handleChange} error={errors.city} options={CITIES} />
            <div className="divider"></div>
            <CustomSelect label="Sub-Community / Caste" name="subCommunity" value={formData.subCommunity} onChange={handleChange} error={errors.subCommunity} options={SUB_COMMUNITIES} />
          </div>
        );
      case 6: 
        return (
          <div className="step-container fade-in">
            <div className="step-icon"><Icons.Heart /></div>
            <h2 className="step-title">Personal Details</h2>
            <CustomSelect label="Marital Status" name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} error={errors.maritalStatus} options={['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce']} />
            <CustomSelect label="Height" name="height" value={formData.height} onChange={handleChange} error={errors.height} options={HEIGHTS} />
            <CustomSelect label="Diet" name="diet" value={formData.diet} onChange={handleChange} error={errors.diet} options={['Veg', 'Non-Veg', 'Eggetarian', 'Jain', 'Vegan']} />
          </div>
        );
      case 7: 
        return (
          <div className="step-container fade-in">
             <div className="step-icon"><Icons.Book /></div>
             <h2 className="step-title">Education</h2>
            <CustomInput label="Highest Qualification" name="highestQualification" value={formData.highestQualification} onChange={handleChange} error={errors.highestQualification} placeholder="e.g. B.Tech, MBA, MS" />
            <CustomInput label="College / University" name="college" value={formData.college} onChange={handleChange} error={errors.college} placeholder="Enter College Name" />
          </div>
        );
      case 8: 
        return (
          <div className="step-container fade-in">
            <div className="step-icon"><Icons.Briefcase /></div>
            <h2 className="step-title">Career & Lifestyle</h2>
            <CustomSelect label="Annual Income" name="annualIncome" value={formData.annualIncome} onChange={handleChange} error={errors.annualIncome} options={INCOMES} />
            <CustomSelect label="Work Type" name="workWith" value={formData.workWith} onChange={handleChange} error={errors.workWith} options={['Private Company', 'Government / PSU', 'Business / Self Employed', 'Defence', 'Not Working']} />
            <CustomSelect label="Job Role" name="workAs" value={formData.workAs} onChange={handleChange} error={errors.workAs} options={PROFESSIONS} />
            <CustomInput label="Current Company Name" name="companyName" value={formData.companyName} onChange={handleChange} error={errors.companyName} placeholder="Enter Company Name" />
          </div>
        );
      default: return null;
    }
  };

  return (
    <>
      <Navbar/>
      <Toaster position="top-center" reverseOrder={false} /> {/* Render Toasts here */}
      <div className="app-container">
        <div className="progress-container">
          <div className="progress-fill" style={{ width: `${(step / 8) * 100}%` }}></div>
        </div>
        <div className="content-area">
          {/* Changed this to proper onSubmit to allow browser password managers to hook in */}
          <form onSubmit={step === 8 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
            {renderStep()}
            <div className="action-area">
              {step > 1 && (
                <button type="button" className="back-btn" onClick={prevStep} disabled={loading}>Back</button>
              )}
              {step === 8 ? (
                 <button type="submit" className="continue-btn primary" disabled={loading}>
                   {loading ? 'Registering...' : 'Complete Profile'}
                 </button>
              ) : (
                 <button type="button" className="continue-btn primary" onClick={nextStep}>Continue</button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
