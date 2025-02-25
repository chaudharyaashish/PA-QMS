import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Appointment.css";
import Profile from "../../components/Profile/Profile";

export default function Appointment() {
  const navigate = useNavigate();

  return (
    <div className="appointment-container">
      {/* Header */}
      <header className="appointment-header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <span className="text-xl font-semibold">
                <span className="text-green-800">PA</span> & {""}
                <span className="text-green">QMS</span>
              </span>
            </div>
            <div className="header-actions">
              <button className="text" onClick={() => navigate("/profile")}>
                Profile
              </button>
              <button className="text">Setting</button>
              <Bell className="icon" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="appointment-main">
        <div className="grid-container">
          {/* Appointment Form */}
          <div className="form-section">
            <h2 className="section-title">Schedule Appointment</h2>

            <div className="form-group">
              <label>Select Department *</label>
              <select className="form-select">
                <option value="">Please Select</option>
                <option value="cardiology">Cardiology</option>
                <option value="neurology">Neurology</option>
                <option value="pediatrics">Pediatrics</option>
              </select>
            </div>

            <div className="form-group">
              <label>Select Doctor *</label>
              <select className="form-select">
                <option value="">Please Select</option>
                <option value="dr-smith">Dr. Smith</option>
                <option value="dr-jones">Dr. Jones</option>
                <option value="dr-wilson">Dr. Wilson</option>
              </select>
            </div>

            <div className="form-group">
              <label>Select Time Slot *</label>
              <select className="form-select">
                <option value="01-01">January 1, 2025</option>
                <option value="01-02">January 2, 2025</option>
                <option value="01-03">January 3, 2025</option>
              </select>
            </div>

            <div className="form-group">
              <label>Time *</label>
              <select className="form-select">
                <option value="4:00">4:00 PM</option>
                <option value="4:30">4:30 PM</option>
                <option value="5:00">5:00 PM</option>
              </select>
            </div>

            <div className="button-group">
              <button className="btn-primary">Confirm Appointment</button>
              <button className="btn-secondary">Reschedule Appointment</button>
              <button className="btn-danger">Cancel Appointment</button>
            </div>
          </div>

          {/* Info Section */}
          <div className="info-section">
            <div className="info-card">
              <h3 className="card-title">Live Queue Status</h3>
              <p className="text-sm">Current Queue Position: 10</p>
              <p className="text-sm">Estimated Waiting Time: 1hr</p>
            </div>

            <div className="info-card">
              <h3 className="card-title">Self-Check In</h3>
              <input
                type="text"
                placeholder="Manual Code"
                className="input-field"
              />
            </div>
          </div>
        </div>
        <div className="profile-section">
          <Profile />
        </div>
      </main>
    </div>
  );
}
