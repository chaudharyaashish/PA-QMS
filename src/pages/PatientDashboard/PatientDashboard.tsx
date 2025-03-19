import Appointment from "../../components/Appointment/Appointment";

export default function PatientDashboard() {
  return (
    <div className="dashboar">
      <section className="appointment-section">
        <Appointment />
      </section>
    </div>
  );
}
