import { useNavigate } from "react-router-dom";
import "./Logout.css";

export default function Logout() {
  const navigate = useNavigate();

  // Retrieve the user type from localStorage (or any global state)
  const userType = localStorage.getItem("userType"); // Assumes 'doctor' or 'patient'

  const handleLogout = () => {
    localStorage.removeItem("userType"); // Optional: Clear user data on logout
    navigate("/");
  };

  const handleCancel = () => {
    if (userType === "doctor") {
      navigate("/doctorDashboard");
    } else {
      navigate("/patientDashboard");
    }
  };

  return (
    <div className="overlay">
      <div className="modal">
        <h1>Are you sure you want to logout?</h1>
        <div className="buttonGroup">
          <button className="yesButton" onClick={handleLogout}>
            YES
          </button>
          <button className="noButton" onClick={handleCancel}>
            NO
          </button>
        </div>
      </div>
    </div>
  );
}
