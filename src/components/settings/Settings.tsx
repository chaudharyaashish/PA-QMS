import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import TabsSection from "../../components/settings/TabsSection";
import styles from "./Settings.module.css";

export default function Settings() {
  const navigate = useNavigate();

  const handleCancel = () => {
    console.log("Cancel button clicked");
    navigate("/PatientDashboard");
  };

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.settingsHeader}>
        <h1 className={styles.settingsTitle}>
          Settings
          <div className={styles.cancel} onClick={handleCancel}>
            <X className={styles.cancelIcon} />
          </div>
        </h1>
      </div>
      <TabsSection />
    </div>
  );
}
