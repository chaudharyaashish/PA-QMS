import { useState } from "react";
import styles from "./Settings.module.css";

export default function AppearanceSettings() {
  const [theme, setTheme] = useState("light");

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>Appearance Settings</h2>
      <p className={styles.cardDescription}>
        Customize the look and feel of the application.
      </p>

      <div className={styles.content}>
        <div className={styles.inputGroup}>
          <label htmlFor="theme">Theme</label>
          <select
            id="theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className={styles.select}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="font-size">Font Size</label>
          <input
            id="font-size"
            type="number"
            placeholder="16"
            min="12"
            max="24"
            className={styles.input}
          />
        </div>
      </div>

      <button className={styles.button}>Save Appearance Settings</button>
    </div>
  );
}
