"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Bell, Mail, MessageSquare } from "lucide-react";
import "./Settings.module.css";
import "./NotificationSettings.css";

interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
}

export default function NotificationSettings() {
  const [notifications, setNotifications] = useState<NotificationPreferences>({
    email: true,
    push: false,
    sms: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleToggleChange = (type: keyof NotificationPreferences) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Notification preferences saved successfully");
    } catch (error) {
      toast.error("Failed to save notification preferences");
    } finally {
      setIsSaving(false);
    }
  };

  const notificationTypes = [
    {
      type: "email" as const,
      label: "Email Notifications",
      description: "Receive notifications via email",
      icon: Mail,
    },
    {
      type: "push" as const,
      label: "Push Notifications",
      description: "Get notified directly in your browser",
      icon: Bell,
    },
    {
      type: "sms" as const,
      label: "SMS Notifications",
      description: "Receive notifications via text message",
      icon: MessageSquare,
    },
  ];

  return (
    <div className="notification-card">
      <div className="notification-header">
        <h2 className="notification-title">Notification Preferences</h2>
        <p className="notification-description">
          Choose how you want to receive notifications
        </p>
      </div>
      <div className="notification-content">
        {notificationTypes.map(({ type, label, description, icon: Icon }) => (
          <div key={type} className="notification-row">
            <div className="notification-info">
              <Icon className="notification-icon" />
              <div>
                <label
                  htmlFor={`${type}-notifications`}
                  className="notification-label"
                >
                  {label}
                </label>
                <p className="notification-text">{description}</p>
              </div>
            </div>
            <input
              type="checkbox"
              id={`${type}-notifications`}
              checked={notifications[type]}
              onChange={() => handleToggleChange(type)}
              className="notification-switch"
              aria-label={label}
            />
          </div>
        ))}
      </div>
      <div className="notification-footer">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="notification-button"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
