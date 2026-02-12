import React, { useState, useEffect } from "react";
import axios from "axios";
import { Phone, Tag, Image as ImageIcon, MapPin } from "lucide-react";
import "./VendorList.css";
import Navbar from "../../Components/Navbar.jsx";

export default function VendorList() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Vendors
  const fetchVendors = async () => {
    try {
      const token = localStorage.getItem("token"); 

      if (!token) {
        setLoading(false);
        return;
      }

      const res = await axios.get("https://kalyanashobha-back.vercel.app/api/user/vendors", {
        headers: { Authorization: token },
      });
      
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
      <div className="vendor-page-container">
        <div className="page-header">
          <h1>Premium Wedding Vendors</h1>
          <p>Curated services to make your special day perfect.</p>
        </div>

        {/* VENDOR GRID */}
        <div className="vendor-grid">
          {loading ? (
             // Simple Loading Skeleton
             [1,2,3,4].map(n => <div key={n} className="vendor-card skeleton-card"></div>)
          ) : vendors.length === 0 ? (
            <div className="no-data-state">
              <h3>No Vendors Found</h3>
              <p>Check back later for new listings.</p>
            </div>
          ) : (
            vendors.map((vendor) => (
              <div key={vendor._id} className="vendor-card">
                
                {/* Image Section */}
                <div className="vendor-image-wrapper">
                  {vendor.images && vendor.images.length > 0 ? (
                    <img src={vendor.images[0]} alt={vendor.businessName} />
                  ) : (
                    <div className="placeholder-img"><ImageIcon size={32} /></div>
                  )}
                  <span className="category-badge">{vendor.category}</span>
                </div>

                {/* Content Section */}
                <div className="vendor-content">
                  <h3 className="vendor-title">{vendor.businessName}</h3>
                  <p className="vendor-desc">
                    {vendor.description ? vendor.description.substring(0, 80) + "..." : "No description available."}
                  </p>
                  
                  <div className="vendor-details">
                    <div className="detail-item">
                      <Tag size={15} className="icon-gold" />
                      <span>{vendor.priceRange || "Price on Request"}</span>
                    </div>
                    <div className="detail-item">
                      <Phone size={15} className="icon-gold" />
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
