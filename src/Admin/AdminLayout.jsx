import { Outlet } from "react-router-dom";
import AdminSidebar from "./Sidebar/AdminSidebar";

const AdminLayout = () => {
  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />
      {/* Main Content Area - Pushed right by 260px (sidebar width) */}
      <main style={{ flex: 1, marginLeft: "260px", minHeight: "100vh", backgroundColor: "#FDFBF7" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
