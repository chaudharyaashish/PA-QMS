import Appointment from "../../components/Appointment/Appointment";

export default function PatientDashboard() {
  return (
    <div className="dashboard-container">
      <section className="appointment-section">
        <Appointment />
      </section>
    </div>
  );
}
