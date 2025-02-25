"use client";

import type React from "react";
import { useState } from "react";
import { Link } from "lucide-react";
import "./EditProfile.css";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+123 456 7890",
    address: "123 Main St, City, Country",
    profilePicture: "https://via.placeholder.com/150",
  });

  const [imageUrl, setImageUrl] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prev) => ({
          ...prev,
          profilePicture: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlUpload = () => {
    if (imageUrl) {
      setProfileData((prev) => ({ ...prev, profilePicture: imageUrl }));
      setImageUrl("");
    }
  };

  const handleSave = () => {
    console.log("Saving profile:", profileData);
  };
  const handleCancel = () => {
    navigate("/profile");
  };

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-modal">
        <h1 className="modal-title">Edit Profile</h1>
        <p className="modal-description">
          Make changes to your profile here. Click save when you&apos;re done.
        </p>

        <div className="modal-content">
          <div className="profile-section">
            <div className="profile">
              <img
                className="profile-image"
                src={profileData.profilePicture || "/placeholder.svg"}
                alt="Profile"
              />
              <div className="profile-inputs">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="file-input"
                />
                <div className="url-upload">
                  <input
                    type="text"
                    placeholder="Paste image URL"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                  <button onClick={handleUrlUpload}>
                    <Link className="icon" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="input-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="input-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleInputChange}
              />
            </div>

            <div className="input-group">
              <label>Address</label>
              <textarea
                name="address"
                value={profileData.address}
                onChange={handleInputChange}
                rows={4}
              ></textarea>
            </div>
          </div>
        </div>

        <div className="button-group">
          <button className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
          <button className="save-button" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
