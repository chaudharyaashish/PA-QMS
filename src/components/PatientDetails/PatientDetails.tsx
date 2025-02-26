import "./PatientDetails.css";
import { Search } from "lucide-react";
import { useState } from "react";

export default function PatientDetails() {
  const [search, setSearch] = useState("");

  const patients = [
    {
      id: 1,
      name: "John Doe",
      age: 45,
      condition: "Hypertension",
      lastVisit: "2024-02-20",
    },
    {
      id: 2,
      name: "Jane Smith",
      age: 32,
      condition: "Diabetes Type 2",
      lastVisit: "2024-02-19",
    },
    {
      id: 3,
      name: "Bob Johnson",
      age: 28,
      condition: "Asthma",
      lastVisit: "2024-02-15",
    },
  ];

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Quick Patient Access</h2>
      </div>
      <div className="card-content">
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search patients..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="scroll-area">
          <div className="patient-list">
            {filteredPatients.map((patient) => (
              <div key={patient.id} className="patient-card">
                <div className="patient-info">
                  <p className="patient-name">{patient.name}</p>
                  <div className="patient-details">
                    <p>Age: {patient.age}</p>
                    <p>Condition: {patient.condition}</p>
                    <p>Last Visit: {patient.lastVisit}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
