import { useNavigate } from "react-router-dom";
import "./Logout.css";

export default function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const handleCancel = () => {
    navigate("/patientDashboard");
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
