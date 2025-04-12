import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./components/Home.jsx";
import Contact from "./components/contact/Contact.jsx";
import Login from "./components/Login";
import Register from "./components/register/Register.jsx";
import UserDashboard from "./pages/user/Dashboard.jsx";
import DoctorDashboard from "./pages/doctor/Dashboard.jsx";
import AdminDashboard from "./pages/admin/Dashboard.jsx";
import DoctorRegistration from "./pages/doctor/DoctorRegistration.jsx";
import BookAppointment from "./pages/user/BookAppointment.jsx";
import UserAppointments from "./pages/user/Appointments.jsx";
import DoctorAppointments from "./pages/doctor/Appointments.jsx";
import DoctorProfile from "./pages/doctor/Profile.jsx";
import UserProfile from "./pages/user/Profile.jsx";
import AdminDoctors from "./pages/admin/Doctors.jsx";
import AdminUsers from "./pages/admin/Users.jsx";
import AdminAppointments from "./pages/admin/Appointments.jsx";
import NotFound from "./pages/NotFound.jsx";

// Auth components
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="w-full d-flex flex-column min-vh-100 mx-auto">
          <Header />
          <main className="flex-shrink-0 py-4">
            <div className="container">
              <Routes>
                {/* Public routes */}
                <Route path="/home" element={<Home />} />
                <Route path="/contact" element={<Contact />} />
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicRoute>
                      <Register />
                    </PublicRoute>
                  }
                />

                {/* User routes */}
                <Route
                  path="/user/dashboard"
                  element={
                    <PrivateRoute allowedRoles={["user", "doctor", "admin"]}>
                      <UserDashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/user/profile"
                  element={
                    <PrivateRoute allowedRoles={["user", "doctor", "admin"]}>
                      <UserProfile />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/user/book-appointment"
                  element={
                    <PrivateRoute allowedRoles={["user"]}>
                      <BookAppointment />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/user/appointments"
                  element={
                    <PrivateRoute allowedRoles={["user"]}>
                      <UserAppointments />
                    </PrivateRoute>
                  }
                />

                {/* Doctor routes */}
                <Route
                  path="/doctor/register"
                  element={
                    <PrivateRoute allowedRoles={["doctor"]}>
                      <DoctorRegistration />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/doctor/dashboard"
                  element={
                    <PrivateRoute allowedRoles={["doctor"]}>
                      <DoctorDashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/doctor/profile"
                  element={
                    <PrivateRoute allowedRoles={["doctor"]}>
                      <DoctorProfile />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/doctor/appointments"
                  element={
                    <PrivateRoute allowedRoles={["doctor"]}>
                      <DoctorAppointments />
                    </PrivateRoute>
                  }
                />

                {/* Admin routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <PrivateRoute allowedRoles={["admin"]}>
                      <AdminDashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/doctors"
                  element={
                    <PrivateRoute allowedRoles={["admin"]}>
                      <AdminDoctors />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <PrivateRoute allowedRoles={["admin"]}>
                      <AdminUsers />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/appointments"
                  element={
                    <PrivateRoute allowedRoles={["admin"]}>
                      <AdminAppointments />
                    </PrivateRoute>
                  }
                />

                {/* Redirect based on role */}
                <Route
                  path="/dashboard"
                  element={<Navigate to="/user/dashboard" replace />}
                />

                {/* 404 Not Found */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </main>
          <Footer />
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
