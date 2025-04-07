import React, { ReactNode } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import ServiceSection from "./pages/ServiceSection/Services.tsx";
import Admin from "./pages/Admin/admin.tsx"
import LandingPage from "./pages/LandingPage/LandingPage.tsx";
import { auth } from "./firebaseConfig.ts";
import Signup from "./components/Signup/Signup.tsx";
import PatientDashboard from "./pages/PatientDashboard/PatientDashboard.tsx";
import Profile from "./components/Profile/Profile.tsx";
import EditProfile from "./components/EditProfile/EditProfile.tsx";
import Settings from "./components/settings/Settings.tsx";
import Logout from "./components/settings/Logout.tsx";
import PatientManagement from "./components/PatientManagement/PatientManagement.tsx";
import AppointmentManagement from "./components/Admin/AppointmentManagement/AppointmentManagement.tsx";
import Dashboard from "./components/Admin/AdminDashboard/Dashboard.tsx";
import QueueManagement from "./components/Admin/QueueMangement/QueueManagement.tsx";
import ContactUs from "./components/contact/Contact.tsx";
import DoctorDashboard from "./components/DoctoraDashboard/DoctorDashboar.tsx";
import Login from "./components/Login/Login.tsx";



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
        <Route path="/contact" element={<ContactUs/>}/>

        <Route
          path="/patientDashboard"
          element={
            <PrivateRoute>
              <PatientDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        />

        <Route
          path="/doctorDashboard"
          element={
            <PrivateRoute>
              <DoctorDashboard />
            </PrivateRoute>
          }
        />
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/patientManagement" element={<PatientManagement />} />
        <Route path="/appointmentManagement" element={<AppointmentManagement />} />
        <Route path="/queueManagement" element={<QueueManagement/>}/>
      </Routes>
    </Router>
  );
};

export default App;
