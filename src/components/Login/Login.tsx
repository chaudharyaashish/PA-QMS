import { Link, useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import img from "../../images/doctor.png";
import { FaRegEye, FaEyeSlash } from "react-icons/fa";
import OAuth from "./oauth";
import {
  AuthErrorCodes,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { toast } from "react-toastify";
import { FirebaseError } from "firebase/app";
import { db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import "./Login.css";

export default function Signin() {
  const [userType, setUserType] = useState<string>("patient");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [seePassword, setSeePassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Fetch user data from Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const storedUserType = userData.userType;

        if (!storedUserType) {
          toast.error("User type not found in database!");
          return;
        }

        if (storedUserType !== userType) {
          toast.error(
            `Login failed! You selected '${userType}', but you are registered as '${storedUserType}'.`
          );
          return;
        }

        toast.success("Logged in Successfully!");

        // Redirect user based on stored user type
        switch (storedUserType) {
          case "admin":
            navigate("/adminDashboard");
            break;
          case "doctor":
            navigate("/doctorDashboard");
            break;
          case "patient":
            navigate("/patientDashboard");
        }
      } else {
        toast.error("User data not found!");
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case AuthErrorCodes.INVALID_EMAIL:
            toast.error("Invalid Email");
            break;
          case AuthErrorCodes.INVALID_LOGIN_CREDENTIALS:
            toast.error("Invalid Credentials");
            break;
          default:
            toast.error("Something went wrong while logging in");
            break;
        }
      }
    }
  };

  return (
    <div className="signin-container">
      {/* Left Section */}
      <div className="signin-left">
        <div className="signin-form-container">
          <div className="signin-logo">
            <span className="font-semibold">
              <span className="text-primary">PA</span> &{" "}
              <span className="text-green">QMS</span>
            </span>
          </div>

          <h1 className="signin-title">LOGIN</h1>

          <form className="signin-form" onSubmit={onSubmit}>
            {/* Email Input */}
            <input
              type="email"
              className="input-field"
              placeholder="Email"
              value={email}
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* User Type Selection */}
            <select
              className="select-field"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              required
            >
              <option value="admin">Admin</option>
              <option value="doctor">Doctor</option>
              <option value="patient">Patient</option>
            </select>

            {/* Password Input */}
            <div className="password-container">
              <input
                type={seePassword ? "text" : "password"}
                autoComplete="off"
                className="input-field"
                placeholder="Password"
                value={password}
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div
                className="eye-icon"
                onClick={() => setSeePassword((prev) => !prev)}
              >
                {seePassword ? <FaEyeSlash /> : <FaRegEye />}
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="signin-button">
              Login Now
            </button>

            {/* Divider */}
            <div className="divider">Login with Others</div>

            {/* OAuth Login */}
            <OAuth />

            {/* Signup Link */}
            <div className="signup-link">
              Don't have an account?{" "}
              <Link to="/signup" className="link">
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Section */}
      <div className="signin-right">
        <div className="thank-you">
          <h2>Thank you</h2>
          <p>for choosing us.</p>
          <div className="signup-icon">
            <img
              src={img}
              alt="key photo"
              className="rounded-xl"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
