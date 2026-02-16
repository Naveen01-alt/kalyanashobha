import React, { useState, useRef, useEffect } from 'react'; 
import { useNavigate, useSearchParams } from 'react-router-dom'; 
import toast, { Toaster } from 'react-hot-toast'; 
import SignatureCanvas from 'react-signature-canvas'; 
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
  ChevronDown: () => <svg className="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>,
  Eye: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>,
  EyeOff: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>,
  ArrowRight: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
};

// --- COMPONENTS ---
// Added 'stagger-item' class for sequential animation
const CustomSelect = ({ label, name, value, onChange, options, error, placeholder = "Select" }) => (
  <div className={`input-group stagger-item ${error ? 'has-error' : ''}`}>
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
  <div className={`input-group stagger-item ${error ? 'has-error' : ''}`}>
    <label>{label}</label>
    <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} autoComplete={autoComplete} />
    {error && <span className="error-msg">{error}</span>}
  </div>
);

const Register = () => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState('forward'); // 'forward' or 'back' for animation logic
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate(); 
  const [searchParams] = useSearchParams();
  const refId = searchParams.get('refId');
  const refName = searchParams.get('refName');

  // --- VERIFICATION STATE ---
  const sigRef = useRef(null); 
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [formData, setFormData] = useState({
    profileFor: 'Myself', gender: 'Male', firstName: '', lastName: '',
    dobDay: '', dobMonth: '', dobYear: '', religion: '', community: '', country: 'India',
    email: '', password: '', mobileNumber: '', state: '', city: '', subCommunity: '',
    maritalStatus: 'Never Married', height: '', diet: 'Veg',
    highestQualification: '', college: '', annualIncome: '', workWith: 'Private Company', workAs: '', companyName: ''
  });

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const selectOption = (name, value) => {
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const clearSignature = () => sigRef.current.clear();

  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  }

  // --- VALIDATION ---
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
      case 1: require("profileFor"); require("gender"); break;
      case 2: require("firstName"); require("lastName"); require("dobDay"); require("dobMonth"); require("dobYear"); break;
      case 3: require("religion"); require("community"); require("country"); break;
      case 4: 
        require("email");
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) { newErrors.email = "Invalid email"; isValid = false; }
        require("password");
        if(formData.password && formData.password.length < 6) { newErrors.password = "Min 6 chars"; isValid = false; }
        require("mobileNumber");
        break;
      case 5: require("state"); require("city"); require("subCommunity"); break;
      case 6: require("maritalStatus"); require("height"); require("diet"); break;
      case 7: require("highestQualification"); require("college"); break;
      case 8: require("annualIncome"); require("workWith"); require("workAs"); require("companyName"); break;
      case 9:
        if (sigRef.current.isEmpty()) { toast.error("Please sign to continue."); isValid = false; }
        if (!termsAccepted) { toast.error("You must accept Terms & Conditions."); isValid = false; }
        break;
      default: break;
    }
    setErrors(newErrors);
    return isValid;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setDirection('forward');
      setStep(step + 1);
    }
  };
  const prevStep = () => {
    setDirection('back');
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (!validateStep(9)) return;
    
    setLoading(true);
    const toastId = toast.loading("Creating Profile..."); 

    try {
      const dobDate = new Date(`${formData.dobYear}-${formData.dobMonth}-${formData.dobDay}`);
      const signatureDataURL = sigRef.current.toDataURL("image/png");
      const signatureFile = dataURLtoFile(signatureDataURL, "signature.png");

      const data = new FormData();
      data.append('firstName', formData.firstName);
      data.append('lastName', formData.lastName);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('mobileNumber', formData.mobileNumber);
      data.append('profileFor', formData.profileFor);
      data.append('gender', formData.gender);
      data.append('dob', dobDate.toISOString());
      data.append('religion', formData.religion);
      data.append('community', formData.community);
      data.append('country', formData.country);
      data.append('state', formData.state);
      data.append('city', formData.city);
      if(formData.subCommunity) data.append('subCommunity', formData.subCommunity);
      if(formData.subCommunity) data.append('caste', formData.subCommunity);
      data.append('maritalStatus', formData.maritalStatus);
      if(formData.diet) data.append('diet', formData.diet);
      const heightVal = parseInt(formData.height ? formData.height.match(/\d+/g)?.pop() || 0 : 0);
      data.append('height', heightVal);
      if(formData.highestQualification) data.append('highestQualification', formData.highestQualification);
      if(formData.college) data.append('collegeName', formData.college);

      let backendWorkType = '';
      if (formData.workWith === 'Private Company') backendWorkType = 'Private';
      else if (formData.workWith === 'Government / PSU') backendWorkType = 'Govt';
      else if (formData.workWith === 'Defence') backendWorkType = 'Govt';
      else if (formData.workWith === 'Business / Self Employed') backendWorkType = 'Business';
      
      if (backendWorkType) {
        data.append('workType', backendWorkType);
      }
      if(formData.workAs) data.append('jobRole', formData.workAs);
      if(formData.companyName) data.append('companyName', formData.companyName);
      if(formData.annualIncome) data.append('annualIncome', formData.annualIncome);
      if (refId) { 
          data.append('referredByAgentId', refId); 
          data.append('referralType', "link"); 
      }
      if (refName) data.append('referredByAgentName', refName);
      data.append('digitalSignature', signatureFile);

      const response = await fetch('https://kalyanashobha-back.vercel.app/api/auth/register', {
        method: 'POST',
        body: data, 
      });

      const resText = await response.text();
      let resData;
      try {
        resData = JSON.parse(resText);
      } catch (jsonError) {
        console.error("Server HTML Error:", resText);
        throw new Error(`Server Error (${response.status})`);
      }

      if (!response.ok) throw new Error(resData.message || "Request failed");

      if (resData.success) {
        toast.success("Registration Successful!", { id: toastId });
        setTimeout(() => { navigate('/login', { state: { savedEmail: formData.email } }); }, 1500);
      } else {
        throw new Error(resData.message || "Registration Failed");
      }

    } catch (error) {
      console.error("Submission Error:", error);
      toast.error(error.message || "Connection Failed", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER STEPS ---
  // Using 'key' on the step container triggers the animation when step changes
  const renderStep = () => {
    // Dynamic animation class based on direction
    const animClass = direction === 'forward' ? 'slide-in-right' : 'slide-in-left';

    switch(step) {
      case 1: 
        return (
          <div key={step} className={`step-container ${animClass}`}>
            <h2 className="reg-title stagger-item">Create Account</h2>
            <p className="reg-subtitle stagger-item">Let's start your journey to finding happiness.</p>
            <h3 className="section-label stagger-item">Profile For</h3>
            <div className="selection-grid stagger-item">
              {['Myself', 'My Son', 'My Daughter', 'My Brother', 'My Sister', 'Friend'].map((opt) => (
                <button key={opt} type="button" className={`selection-btn ${formData.profileFor === opt ? 'selected' : ''}`} onClick={() => selectOption('profileFor', opt)}>{opt}</button>
              ))}
            </div>
            <h3 className="section-label stagger-item">Gender</h3>
            <div className="selection-grid stagger-item">
              {['Male', 'Female'].map((gen) => (
                <button key={gen} type="button" className={`selection-btn ${formData.gender === gen ? 'selected' : ''}`} onClick={() => selectOption('gender', gen)}>{gen}</button>
              ))}
            </div>
          </div>
        );
      case 2: return (
          <div key={step} className={`step-container ${animClass}`}>
            <h2 className="reg-title stagger-item">Basic Details</h2>
            <CustomInput label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} error={errors.firstName} placeholder="First Name" />
            <CustomInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} error={errors.lastName} placeholder="Last Name" />
            <h3 className="section-label stagger-item">Date of Birth</h3>
            <div className="dob-container stagger-item" style={{display:'flex', gap:'10px'}}>
              <input type="number" name="dobDay" placeholder="DD" value={formData.dobDay} onChange={handleChange} style={{padding:'12px', width:'60px', borderRadius:'8px', border:'1px solid #E0E0E0'}} />
              <input type="number" name="dobMonth" placeholder="MM" value={formData.dobMonth} onChange={handleChange} style={{padding:'12px', width:'60px', borderRadius:'8px', border:'1px solid #E0E0E0'}} />
              <input type="number" name="dobYear" placeholder="YYYY" value={formData.dobYear} onChange={handleChange} style={{padding:'12px', flex:1, borderRadius:'8px', border:'1px solid #E0E0E0'}} />
            </div>
          </div>
        );
      case 3: return (
          <div key={step} className={`step-container ${animClass}`}>
            <h2 className="reg-title stagger-item">Religion & Community</h2>
            <CustomSelect label="Religion" name="religion" value={formData.religion} onChange={handleChange} error={errors.religion} options={RELIGIONS} />
            <CustomSelect label="Community" name="community" value={formData.community} onChange={handleChange} error={errors.community} options={COMMUNITIES} />
            <CustomSelect label="Country" name="country" value={formData.country} onChange={handleChange} error={errors.country} options={COUNTRIES} />
          </div>
        );
      case 4: return (
          <div key={step} className={`step-container ${animClass}`}>
            <h2 className="reg-title stagger-item">Contact & Security</h2>
            <CustomInput label="Email ID" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} placeholder="name@example.com" />
            <div className={`input-group stagger-item ${errors.password ? 'has-error' : ''}`}>
              <label>Create Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="Min. 6 characters" style={{ width: '100%', paddingRight: '40px', boxSizing: 'border-box' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>{showPassword ? <Icons.EyeOff /> : <Icons.Eye />}</button>
              </div>
              {errors.password && <span className="error-msg">{errors.password}</span>}
            </div>
            <CustomInput label="Mobile Number" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} error={errors.mobileNumber} placeholder="9876543210" />
          </div>
        );
      case 5: return (
          <div key={step} className={`step-container ${animClass}`}>
             <h2 className="reg-title stagger-item">Current Location</h2>
            <CustomSelect label="State" name="state" value={formData.state} onChange={handleChange} error={errors.state} options={STATES} />
            <CustomSelect label="City" name="city" value={formData.city} onChange={handleChange} error={errors.city} options={CITIES} />
            <CustomSelect label="Sub-Community / Caste" name="subCommunity" value={formData.subCommunity} onChange={handleChange} error={errors.subCommunity} options={SUB_COMMUNITIES} />
          </div>
        );
      case 6: return (
          <div key={step} className={`step-container ${animClass}`}>
            <h2 className="reg-title stagger-item">Personal Details</h2>
            <CustomSelect label="Marital Status" name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} error={errors.maritalStatus} options={['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce']} />
            <CustomSelect label="Height" name="height" value={formData.height} onChange={handleChange} error={errors.height} options={HEIGHTS} />
            <CustomSelect label="Diet" name="diet" value={formData.diet} onChange={handleChange} error={errors.diet} options={['Veg', 'Non-Veg', 'Eggetarian', 'Jain', 'Vegan']} />
          </div>
        );
      case 7: return (
          <div key={step} className={`step-container ${animClass}`}>
             <h2 className="reg-title stagger-item">Education</h2>
            <CustomInput label="Highest Qualification" name="highestQualification" value={formData.highestQualification} onChange={handleChange} error={errors.highestQualification} placeholder="e.g. B.Tech" />
            <CustomInput label="College / University" name="college" value={formData.college} onChange={handleChange} error={errors.college} placeholder="College Name" />
          </div>
        );
      case 8: return (
          <div key={step} className={`step-container ${animClass}`}>
            <h2 className="reg-title stagger-item">Career & Lifestyle</h2>
            <CustomSelect label="Annual Income" name="annualIncome" value={formData.annualIncome} onChange={handleChange} error={errors.annualIncome} options={INCOMES} />
            <CustomSelect label="Work Type" name="workWith" value={formData.workWith} onChange={handleChange} error={errors.workWith} options={['Private Company', 'Government / PSU', 'Business / Self Employed', 'Defence', 'Not Working']} />
            <CustomSelect label="Job Role" name="workAs" value={formData.workAs} onChange={handleChange} error={errors.workAs} options={PROFESSIONS} />
            <CustomInput label="Current Company" name="companyName" value={formData.companyName} onChange={handleChange} error={errors.companyName} placeholder="Company Name" />
          </div>
        );
      case 9:
        return (
            <div key={step} className={`step-container ${animClass}`}>
                <h2 className="reg-title stagger-item">Identity Verification</h2>
                <p className="stagger-item" style={{fontSize: '14px', color: '#666', marginBottom: '20px'}}>
                    Please provide your digital signature to accept the Terms & Conditions.
                </p>

                {/* SIGNATURE ONLY */}
                <h3 className="section-label stagger-item">Digital Signature</h3>
                <div className="stagger-item" style={{ border: '2px dashed #ccc', borderRadius: '8px', overflow: 'hidden', background: '#f9f9f9', marginBottom: '10px' }}>
                    <SignatureCanvas 
                        ref={sigRef}
                        penColor="black"
                        canvasProps={{ width: 340, height: 160, className: 'sigCanvas' }}
                        backgroundColor="#f9f9f9"
                    />
                </div>
                <button className="stagger-item" type="button" onClick={clearSignature} style={{ fontSize: '12px', color: '#ff4444', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '20px' }}>
                    Clear Signature
                </button>

                <div className="stagger-item" style={{height: '1px', background: '#eee', margin: '20px 0'}}></div>

                {/* CONSENT */}
                <div className="stagger-item" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <input 
                        type="checkbox" 
                        id="terms" 
                        checked={termsAccepted} 
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        style={{ marginTop: '4px' }}
                    />
                    <label htmlFor="terms" style={{ fontSize: '13px', color: '#555', lineHeight: '1.4' }}>
                        I declare that the information provided is true and I agree to the <b style={{color: '#D32F2F'}}>Terms & Conditions</b>.
                    </label>
                </div>
            </div>
        );
      default: return null;
    }
  };

  return (
    <>
      <Navbar/>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="app-container">
        {/* Progress Header */}
        <div className="progress-header">
           <div className="step-indicator-text">STEP {step} OF 9</div>
           <div className="progress-track">
              <div className="progress-fill" style={{ width: `${(step / 9) * 100}%` }}></div>
           </div>
        </div>

        <div className="content-area">
          <form onSubmit={step === 9 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
            {renderStep()}
            
            <div className="action-area">
              {step > 1 && (
                <button type="button" className="back-btn" onClick={prevStep} disabled={loading}>Back</button>
              )}
              {step === 9 ? (
                 <button type="submit" className="btn-continue" disabled={loading}>
                   {loading ? 'Registering...' : 'Complete Verification'} <Icons.ArrowRight />
                 </button>
              ) : (
                 <button type="button" className="btn-continue" onClick={nextStep}>
                   Continue <Icons.ArrowRight />
                 </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
