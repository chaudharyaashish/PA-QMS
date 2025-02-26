"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Settings, User } from "lucide-react";
import "./DoctorHeader.css";

export default function DoctorHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="dashboard-header">
      <div className="header-container">
        {/* Logo Section */}
        <div className="logo">
          <Link to="/" className="logo-text">
            PA & QMS
          </Link>
        </div>

        {/* Header Actions */}
        <div className="header-actions">
          {/* Notifications Dropdown */}
          <div className="notification-container">
            <button
              className="notification-btn"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <Bell className="icon" />
              <span className="notification-badge">3</span>
              <span className="sr-only">Notifications</span>
            </button>
            {isDropdownOpen && (
              <ul className="notification-menu">
                <li className="notification-item">
                  <p className="title">New appointment request</p>
                  <p className="time">2 minutes ago</p>
                </li>
                <li className="notification-item">
                  <p className="title">Appointment rescheduled</p>
                  <p className="time">1 hour ago</p>
                </li>
                <li className="notification-item">
                  <p className="title">Patient update available</p>
                  <p className="time">2 hours ago</p>
                </li>
              </ul>
            )}
          </div>

          {/* Settings Button */}
          <Link to="/settings" className="icon-btn">
            <Settings className="icon" />
            <span className="sr-only">Settings</span>
          </Link>

          {/* Profile Button */}
          <Link to="/profile" className="icon-btn">
            <User className="icon" />
            <span className="sr-only">Profile</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
