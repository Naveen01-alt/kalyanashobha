import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import './AdminCertificates.css'; // IMPORT THE CSS

const AdminCertificates = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(
        "https://kalyanashobha-back.vercel.app/api/admin/users",
        { headers: { Authorization: token } }
      );
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // 2. Download Certificate
  const downloadCertificate = async (userId) => {
    try {
      const token = localStorage.getItem("adminToken");
      const loadToast = toast.loading("Generating Certificate...");

      const response = await axios.get(
        `https://kalyanashobha-back.vercel.app/api/admin/user-certificate/${userId}`,
        {
          headers: { Authorization: token },
          responseType: "text",
        }
      );

      toast.dismiss(loadToast);

      // Open Print Dialog
      const printWindow = window.open("", "_blank");
      printWindow.document.write(response.data);
      printWindow.document.write(`
        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 500);
          }
        </script>
      `);
      printWindow.document.close();

    } catch (error) {
      toast.dismiss();
      toast.error("Error generating certificate");
    }
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">User Certificates</h2>

      <div className="table-card">
        {loading ? (
          <div className="loading-state">Loading user data...</div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Profile ID</th>
                  <th>User Name</th>
                  <th>Email Address</th>
                  <th>Legal Status</th>
                  <th style={{ textAlign: "center" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td style={{ fontWeight: "600" }}>{user.uniqueId || "N/A"}</td>
                    <td>{user.firstName} {user.lastName}</td>
                    <td className="text-muted">{user.email}</td>
                    
                    {/* Status Badge */}
                    <td>
                      {user.digitalSignature ? (
                        <span className="badge badge-signed">✓ Signed</span>
                      ) : (
                        <span className="badge badge-pending">Pending</span>
                      )}
                    </td>

                    {/* Action Button */}
                    <td style={{ textAlign: "center" }}>
                      {user.digitalSignature ? (
                        <button
                          className="btn-download"
                          onClick={() => downloadCertificate(user._id)}
                        >
                          {/* SVG Icon for Download */}
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                          </svg>
                          Download PDF
                        </button>
                      ) : (
                        <button className="btn-disabled" disabled>
                          Not Available
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCertificates;
