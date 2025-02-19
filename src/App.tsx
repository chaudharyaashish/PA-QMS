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
