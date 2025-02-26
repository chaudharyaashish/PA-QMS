import "./PatientManagement.css";
import { useState } from "react";

export default function PatientManagement() {
  const [selectedPatient, setSelectedPatient] = useState("");

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Patient Management</h2>
      </div>
      <div className="card-content">
        <form className="form">
          <div className="form-group">
            <label htmlFor="patient">Select Patient</label>
            <select
              id="patient"
              className="select"
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
            >
              <option value="" disabled>Select patient</option>
              <option value="john-doe">John Doe</option>
              <option value="jane-smith">Jane Smith</option>
              <option value="bob-johnson">Bob Johnson</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="prescription">Prescription</label>
            <textarea id="prescription" placeholder="Enter prescription details..." className="textarea"></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea id="notes" placeholder="Add any additional notes..." className="textarea"></textarea>
          </div>
          <button type="submit" className="button">Update Patient Record</button>
        </form>
      </div>
    </div>
  );
}
