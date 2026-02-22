import { Routes, Route, Navigate } from "react-router-dom";

// --- USER IMPORTS ---
import Navbar from "./User/Components/Navbar.jsx";
import Herobanner from "./User/Components/Herobanner.jsx";
import Footer from "./User/Components/Footer.jsx";
import ProcessFlow from "./User/Components/ProcessFlow.jsx";
import Registration from "./User/Pages/Registration/Registration.jsx";
import Login from "./User/Pages/Login/Login.jsx";
import UserDashboard from "./User/Pages/UserDashboard/UserDashboard.jsx";
import PayRegistration from "./User/Pages/PaymentRegistration/PaymentRegistration.jsx";
import Payments from "./User/Pages/Payments/Payments.jsx";
import Myprofile from "./User/Pages/MyProfile/MyProfile.jsx";
import Interests from "./User/Pages/Interests.jsx";
import UserVendor from "./User/Pages/VendorList/VendorList.jsx"; 
import Stats from "./User/Components/Stats.jsx";
import SuccessStories from "./User/Components/SuccessStories.jsx";
// --- AGENT PORTAL IMPORTS ---
import AgentLogin from "./Agents/AgentLogin.jsx"; 
import AgentDashboard from "./Agents/AgentDashboard.jsx"; 

// --- ADMIN IMPORTS ---
import AdminLogin from "./Admin/Login/AdminLogin.jsx";
import AdminDashboard from "./Admin/Dashboard/Dashboard.jsx";
import AdminCertificate from "./Admin/AdminCertificate/AdminCertificates.jsx";
import AdminLayout from "./Admin/AdminLayout.jsx";
import UserManagement from "./Admin/User/UserManagement.jsx";
import RegistrationApprovals from "./Admin/RegistrationApprovals/RegistrationApprovals.jsx";
import InterestApproval from "./Admin/InterestApproval/InterestApprovals.jsx";
import AdminAgentManagement from "./Admin/AgentManagement/AgentManagement.jsx"; 
import AdminVendor from "./Admin/VendorManagement/VendorManagement.jsx"; 

// 1. Protected Route Component (FOR USERS)
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  // If no user token, send to Home
  return token ? children : <Navigate to="/" replace />;
};

// 2. Public Route Component (FOR USERS)
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  // If user already has token, send to Dashboard
  return token ? <Navigate to="/dashboard" replace /> : children;
};

// 3. Protected Route Component (FOR AGENTS)
const ProtectedAgentRoute = ({ children }) => {
  const token = localStorage.getItem("agentToken");
  return token ? children : <Navigate to="/agent/login" replace />;
};

// 4. Protected Route Component (FOR ADMIN)
const ProtectedAdminRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  return token ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  return (
    <Routes>
      {/* --- OPEN ACCESS ROUTES (Accessible by ANYONE) --- */}
      {/* We moved /vendor here and removed the ProtectedRoute wrapper */}
      <Route path="/vendor" element={<UserVendor />} />

      {/* --- PUBLIC USER ROUTES (Redirects to Dashboard if already logged in) --- */}
      <Route 
        path="/" 
        element={
          <PublicRoute>
            <>
              <Navbar />
              <Herobanner />
              <ProcessFlow />
              <Stats />
              <SuccessStories />
              <Footer />
            </>
          </PublicRoute>
        } 
      />
      <Route path="/registration" element={<PublicRoute><Registration /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

      {/* --- PROTECTED USER ROUTES (Login Required) --- */}
      <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
      <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
      <Route path="/interests" element={<ProtectedRoute><Interests /></ProtectedRoute>} />
      <Route path="/myprofile" element={<ProtectedRoute><Myprofile /></ProtectedRoute>} />
      <Route path="/payment-registration" element={<ProtectedRoute><PayRegistration /></ProtectedRoute>} />

      {/* --- AGENT PORTAL ROUTES --- */}
      <Route path="/agent/login" element={<AgentLogin />} />
      <Route path="/agent/dashboard" element={
        <ProtectedAgentRoute>
          <AgentDashboard />
        </ProtectedAgentRoute>
      } />

      {/* --- ADMIN ROUTES --- */}
      <Route path="/admin/login" element={<AdminLogin />} />
      
      <Route path="/admin" element={<ProtectedAdminRoute><AdminLayout /></ProtectedAdminRoute>}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="registration-approvals" element={<RegistrationApprovals />} />
        <Route path="interest-approvals" element={<InterestApproval />} />
        <Route path="agents" element={<AdminAgentManagement />} /> 
        <Route path="vendors" element={<AdminVendor />} />
       <Route path="user-certificates" element={<AdminCertificate />} />
      </Route>
    </Routes>
  );
}

export default App;
