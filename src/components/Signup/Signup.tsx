import { Link, useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import img from "../../images/doctor.png";
import OAuth from "../Login/oauth";
import {
  AuthErrorCodes,
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import { FirebaseError } from "firebase/app";
import axios from "axios";
import "./Signup.css";

export default function Signup() {
  const [userType, setUserType] = useState("patient");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [certification, setCertification] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      // Firebase Auth: Create user
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Set display name
      await updateProfile(user, { displayName: name });

      // Send user data to backend (MySQL)
      await axios.post("http://localhost:5000/api/auth/signup", {
        uid: user.uid,
        name,
        email,
        userType,
        specialist: userType === "doctor" ? specialist : undefined,
        certification: userType === "doctor" ? certification : undefined,
      });

      toast.success("Account created successfully!");
      navigate("/signin");
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case AuthErrorCodes.EMAIL_EXISTS:
            toast.error("Email already in use");
            break;
          default:
            toast.error("Error during signup");
            console.error(error);
        }
      } else if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || "Backend error");
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="signup-container">
      {/* Left Side */}
      <div className="signup-left">
        <div className="signup-left-content">
          <h2>Welcome</h2>
          <p>Join us today!</p>
          <div className="signup-icon">
            <img src={img} alt="doctor" className="rounded-xl" loading="lazy" />
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="signup-right">
        <div className="signup-form-container">
          {/* Logo */}
          <div className="signup-logo">
            <span className="font-semibold">
              <span className="text-purple">PA</span> &{" "}
              <span className="text-green">QMS</span>
            </span>
          </div>

          {/* Title */}
          <div className="signup-title">
            <h1>Create Account</h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="signup-form">
            <select
              className="signup-input"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              required
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>

            <input
              type="text"
              className="signup-input"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="email"
              className="signup-input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              className="signup-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <input
              type="password"
              className="signup-input"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {/* Additional fields for doctors */}
            {userType === "doctor" && (
              <>
                <input
                  type="text"
                  className="signup-input"
                  placeholder="Specialization"
                  value={specialist}
                  onChange={(e) => setSpecialist(e.target.value)}
                />
                <input
                  type="text"
                  className="signup-input"
                  placeholder="Certification"
                  value={certification}
                  onChange={(e) => setCertification(e.target.value)}
                />
              </>
            )}

            <button type="submit" className="signup-button">
              Sign Up
            </button>

            <div className="signup-divider">
              <span className="divider-text">Sign up with Others</span>
            </div>

            <OAuth />

            <div className="signup-footer">
              Already have an account?{" "}
              <Link to="/signin" className="signup-link">
                Log in
              </Link>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
