import { Mail, Phone, MapPin, Edit2 } from "lucide-react";
import "./Profile.css"; // Import the CSS file
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate("/edit-profile"); 
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Background Header */}
        <div className="profile-header"></div>

        {/* Profile Avatar */}
        <div className="profile-avatar">
          <img src="" alt="Profile Picture" />
        </div>

        {/* Profile Info */}
        <h1 className="profile-name">John Doe</h1>

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
          <button className="btn-primary" onClick={handleEditProfile}>
            <Edit2 className="btn-icon" /> Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
