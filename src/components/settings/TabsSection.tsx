import { useState } from "react";
import NotificationSettings from "./NotificationSettings";
import AppearanceSettings from "../../components/settings/AppearenceSettings";
import Logout from "../../components/settings/Logout";
import styles from "./Settings.module.css";
import Password from "../../components/settings/Password";

export default function TabsSection() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabsList}>
        <button
          onClick={() => setActiveTab("password")}
          className={styles.tabButton}
        >
          Password
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={styles.tabButton}
        >
          Notifications
        </button>
        <button
          onClick={() => setActiveTab("appearance")}
          className={styles.tabButton}
        >
          Appearance
        </button>
        <button
          onClick={() => setActiveTab("logout")}
          className={styles.tabButton}
        >
          LogOut
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === "password" && <Password />}
        {activeTab === "notifications" && <NotificationSettings />}
        {activeTab === "appearance" && <AppearanceSettings />}
        {activeTab === "logout" && <Logout />}
      </div>
    </div>
  );
}
