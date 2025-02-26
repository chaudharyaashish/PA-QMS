import DoctorHeader from "../../components/DoctorHeader/DoctorHeader";
import DailySchedule from "../../components/DailySchedule/DailySchedule";
import PatientDetails from "../../components/PatientDetails/PatientDetails";
import PatientManagement from "../../components/PatientManagement/PatientManagement";
import AppointmentManagement from "../../components/AppointmentManagement/AppointmentManagement";
import "./DoctorDashBoard.css";

export default function DoctorDashboard() {
  return (
    <div className="doctor-dashboard">
      <DoctorHeader />
      <main className="dashboard-main">
        <div className="dashboard-grid">
          <DailySchedule />
          <PatientDetails />
        </div>
        <div className="dashboard-grid">
          <PatientManagement />
          <AppointmentManagement />
        </div>
      </main>
    </div>
  );
}
