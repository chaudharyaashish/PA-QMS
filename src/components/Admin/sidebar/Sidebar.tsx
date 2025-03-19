import { Users, Calendar, List, FileText, Settings, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./sidebar.css";

export function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>Admin Panel</h1>
      </div>
      <nav className="sidebar-menu">
        <button onClick={() => navigate("/admin/dashboard")} className="sidebar-item">
          <List className="icon" />
          Dashboard
        </button>
        <button onClick={() => navigate("/admin/users")} className="sidebar-item">
          <Users className="icon" />
          Patient Management
        </button>
        <button onClick={() => navigate("/admin/appointments")} className="sidebar-item">
          <Calendar className="icon" />
          Appointment Management
        </button>
        <button onClick={() => navigate("/admin/queue")} className="sidebar-item">
          <List className="icon" />
          Queue Management
        </button>
        <button onClick={() => navigate("/admin/reports")} className="sidebar-item">
          <FileText className="icon" />
          Reports
        </button>
        <button onClick={() => navigate("/admin/settings")} className="sidebar-item">
          <Settings className="icon" />
          Settings
        </button>
        <button onClick={() => navigate("/admin/notifications")} className="sidebar-item">
          <Bell className="icon" />
          Notifications
        </button>
      </nav>
    </div>
  );
}

export default Sidebar;
