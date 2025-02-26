import { Bell, Users, Calendar, List, FileText, Settings } from "lucide-react";
import "./admin.css";

export default function AdminDashboard() {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-title">Admin Panel</h1>
        </div>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item active">
            <List className="icon" />
            Dashboard
          </a>
          <a href="#" className="nav-item">
            <Users className="icon" />
            User Management
          </a>
          <a href="#" className="nav-item">
            <Calendar className="icon" />
            Appointment Management
          </a>
          <a href="#" className="nav-item">
            <List className="icon" />
            Queue Management
          </a>
          <a href="#" className="nav-item">
            <FileText className="icon" />
            Reports
          </a>
          <a href="#" className="nav-item">
            <Settings className="icon" />
            Settings
          </a>
          <a href="#" className="nav-item">
            <Bell className="icon" />
            Notifications
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="header">
          <div className="header-container">
            <h2 className="header-title">Dashboard</h2>
            <button className="notification-button">
              <Bell className="icon" />
            </button>
          </div>
        </header>

        <main className="content">
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Patient Queue</h3>
              </div>
              <div className="card-content">
                <span className="card-value">5</span>
                <p className="card-text">Current patients in queue</p>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Doctor Availability</h3>
              </div>
              <div className="card-content">
                <span className="card-value">3</span>
                <p className="card-text">Available doctors</p>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Revenue</h3>
              </div>
              <div className="card-content">
                <span className="card-value">$15,000</span>
                <p className="card-text">This Month</p>
              </div>
            </div>
          </div>

          {/* Recent Appointments Table */}
          <div className="table-container">
            <div className="table-header">
              <h3 className="table-title">Recent Appointments</h3>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Doctor</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>John Doe</td>
                  <td>Dr. Smith</td>
                  <td>10:00 AM</td>
                  <td>
                    <span className="status scheduled">Scheduled</span>
                  </td>
                </tr>
                <tr>
                  <td>Jane Doe</td>
                  <td>Dr. Brown</td>
                  <td>10:30 AM</td>
                  <td>
                    <span className="status checked-in">Checked In</span>
                  </td>
                </tr>
                <tr>
                  <td>Mike Johnson</td>
                  <td>Dr. White</td>
                  <td>11:00 AM</td>
                  <td>
                    <span className="status completed">Completed</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
