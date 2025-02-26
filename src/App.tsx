import React, { ReactNode } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import Login from "./components/Login/Login";
import ServiceSection from "./pages/ServiceSection/Services.tsx";
import AdminDashboard from "./components/Admin/AdminDashboard";
import LandingPage from "./pages/LandingPage/LandingPage.tsx";
import { auth } from "./firebaseConfig.ts";
import Signup from "./components/Signup/Signup.tsx";
import PatientDashboard from "./pages/PatientDashboard/PatientDashboard.tsx";
import Profile from "./components/Profile/Profile.tsx";
import EditProfile from "./components/EditProfile/EditProfile.tsx";
import Settings from "./components/settings/Settings.tsx";
import Logout from "./components/settings/Logout.tsx";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const [user] = useAuthState(auth);

  // If the user is not authenticated, navigate to login.
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route index path="/" element={<LandingPage />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/services" element={<ServiceSection />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/logout" element={<Logout />} />
        <Route
          path="/patientDashboard"
          element={
            <PrivateRoute>
              <PatientDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
