import { useState } from "react";
import { KeyRound } from "lucide-react";
import "./Password.css";

export default function Password() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Define the type for the form data
  type FormData = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev: FormData) => ({ ...prev, [id]: value }));
  };

  // Handle form submission
  const handlePasswordChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Changing password...", formData);
  };

  return (
    <div className="password-card">
      <div className="password-header">
        <h2>Change Password</h2>
        <p>Update your password to keep your account secure.</p>
      </div>
      <form onSubmit={handlePasswordChange} className="password-form">
        <div className="input-group">
          <label htmlFor="currentPassword">Current Password</label>
          <input
            id="currentPassword"
            type="password"
            placeholder="Enter current password"
            value={formData.currentPassword}
            onChange={handleChange}
          />
        </div>
        <div className="input-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            id="newPassword"
            type="password"
            placeholder="Enter new password"
            value={formData.newPassword}
            onChange={handleChange}
          />
          <p className="info-text">
            Password must be at least 8 characters long and include a number, a
            symbol, and an uppercase letter.
          </p>
        </div>
        <div className="input-group">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="update-button">
          <KeyRound className="icon" /> Update Password
        </button>
      </form>
    </div>
  );
}
