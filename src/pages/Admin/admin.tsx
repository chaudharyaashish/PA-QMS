import Sidebar from "@/components/Admin/sidebar/Sidebar";
import Header from "@/components/Admin/header/Header";
import "./admin.css";

export default function AdminDashboard() {
  return (
    <div className="dashboard-container">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content */}
      <div className="main-content">
        {/* Header Component */}
        <Header />
        </div>
    </div>
  );
}
