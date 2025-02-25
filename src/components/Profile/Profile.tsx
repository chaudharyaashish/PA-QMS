import { Mail, Phone, MapPin, Edit2 } from "lucide-react";
import "./Profile.css"; // Import the CSS file

export default function Profile() {
  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Background Header */}
        <div className="profile-header"></div>

        {/* Profile Avatar */}
        <div className="profile-avatar">
          <img src="https://via.placeholder.com/150" alt="Profile picture" />
        </div>

        {/* Profile Info */}
        <h1 className="profile-name">John Doe</h1>
        <span className="profile-badge">Premium Member</span>

        <div className="profile-details">
          <div className="profile-info">
            <Mail className="icon" />
            <div>
              <p className="info-title">Email</p>
              <p className="info-value">johndoe@example.com</p>
            </div>
          </div>

          <div className="profile-info">
            <Phone className="icon" />
            <div>
              <p className="info-title">Phone</p>
              <p className="info-value">+123 456 7890</p>
            </div>
          </div>

          <div className="profile-info">
            <MapPin className="icon" />
            <div>
              <p className="info-title">Address</p>
              <p className="info-value">123 Main St, City, Country</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="profile-buttons">
          <button className="btn-primary">
            <Edit2 className="btn-icon" /> Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
