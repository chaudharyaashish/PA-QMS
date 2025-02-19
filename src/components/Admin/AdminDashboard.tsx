import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebaseConfig";
import "./admin.css";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut();
    navigate("/signin");
  };

  return (
    <div>
      <h1>Welcome to the Admin Dashboard</h1>

      <h1 className="text-2xl font-bold">
        {auth.currentUser && auth.currentUser.displayName}
      </h1>
      <h2 className="font-bold">
        {auth.currentUser && auth.currentUser.email}
      </h2>
      <h2 className="font-bold"></h2>
      <img
        src={
          auth.currentUser && auth.currentUser.photoURL
            ? auth.currentUser.photoURL
            : ""
        }
        className="w-[150px] h-[150px]"
        alt=""
      />
      <button
        onClick={handleLogout}
        className="border bg-black text-white p-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default AdminDashboard;
