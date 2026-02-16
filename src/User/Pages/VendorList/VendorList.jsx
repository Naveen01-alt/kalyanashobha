import React, { useState, useEffect } from "react";
import axios from "axios";
import { Phone, Tag, Image as ImageIcon } from "lucide-react";
import "./VendorList.css";
import Navbar from "../../Components/Navbar"; // Adjust path if necessary based on your folder structure

export default function VendorList() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Vendors
  const fetchVendors = async () => {
    try {
      const token = localStorage.getItem("token"); 

      // --- CHANGE START ---
      // We removed the "if (!token) return" block.
      // Now, we create a config object. If a token exists, we add it. 
      // If not, we send the request without it.
      
      const config = {};
      if (token) {
        config.headers = { Authorization: token };
      }
      
      // The API call now runs for everyone (logged in or not)
      const res = await axios.get("https://kalyanashobha-back.vercel.app/api/user/vendors", config);
      // --- CHANGE END ---
      
      if (res.data.success) {
        setVendors(res.data.vendors);
      }
    } catch (err) {
      console.error("Error fetching vendors", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <>
      <Navbar/>
      <div className="v-premium-container">
        
        {/* HEADER SECTION */}
        <div className="v-premium-header">
          <h1>Premium Wedding Vendors</h1>
          <p>Curated services to make your special day perfect.</p>
        </div>

        {/* VENDOR GRID */}
        <div className="v-premium-grid">
          {loading ? (
             // Simple Loading Skeleton
             [1,2,3,4].map(n => <div key={n} className="v-premium-card v-skeleton"></div>)
          ) : vendors.length === 0 ? (
            <div className="v-no-data">
              <h3>No Vendors Found</h3>
              <p>Check back later for new listings.</p>
            </div>
          ) : (
            vendors.map((vendor) => (
              <div key={vendor._id} className="v-premium-card">
                
                {/* Image Section */}
                <div className="v-card-image">
                  {vendor.images && vendor.images.length > 0 ? (
                    <img src={vendor.images[0]} alt={vendor.businessName} />
                  ) : (
                    <div className="v-placeholder"><ImageIcon size={32} /></div>
                  )}
                  <span className="v-badge-category">{vendor.category}</span>
                </div>

                {/* Content Section */}
                <div className="v-card-content">
                  <h3 className="v-card-title">{vendor.businessName}</h3>
                  <p className="v-card-desc">
                    {vendor.description ? vendor.description.substring(0, 80) + "..." : "No description available."}
                  </p>
                  
                  <div className="v-card-details">
                    <div className="v-detail-row">
                      <Tag size={15} className="v-icon-gold" />
                      <span>{vendor.priceRange || "Price on Request"}</span>
                    </div>
                    <div className="v-detail-row">
                      <Phone size={15} className="v-icon-gold" />
                      {/* Optional: You might want to hide the phone number if not logged in */}
                      <span>{vendor.contactNumber}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
