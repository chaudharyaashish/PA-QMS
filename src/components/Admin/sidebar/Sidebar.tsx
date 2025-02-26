import { Users, Calendar, List, FileText, Settings, BellIcon } from "lucide-react"
import "./sidebar.css"

export function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>Admin Panel</h1>
      </div>
      <nav className="sidebar-menu">
        <a href="#" className="sidebar-item active">
          <List className="icon" />
          Dashboard
        </a>
        <a href="#" className="sidebar-item">
          <Users className="icon" />
          User Management
        </a>
        <a href="#" className="sidebar-item">
          <Calendar className="icon" />
          Appointment Management
        </a>
        <a href="#" className="sidebar-item">
          <List className="icon" />
          Queue Management
        </a>
        <a href="#" className="sidebar-item">
          <FileText className="icon" />
          Reports
        </a>
        <a href="#" className="sidebar-item">
          <Settings className="icon" />
          Settings
        </a>
        <a href="#" className="sidebar-item">
          <BellIcon className="icon" />
          Notifications
        </a>
      </nav>
    </div>
  )
}

export default Sidebar
