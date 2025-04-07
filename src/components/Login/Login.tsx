import { Link, useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import img from "../../images/doctor.png"
import { FaRegEye, FaEyeSlash } from "react-icons/fa";
import OAuth from "./oauth";
import {
  AuthErrorCodes,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { toast } from "react-toastify";
import { FirebaseError } from "firebase/app";
import axios from "axios";
import "./Login.css";

export default function Signin() {
  const [userType, setUserType] = useState<string>("patient");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [seePassword, setSeePassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Basic validation
    if (!email || !password) {
      toast.error("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      // 1. Authenticate with Firebase
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 2. Fetch user data from MySQL backend
      const response = await axios.get(`http://localhost:5000/api/users/${user.uid}`, {
        headers: {
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
      });

      const userData = response.data;

      if (!userData) {
        toast.error("User data not found in database!");
        setIsLoading(false);
        return;
      }

      // 3. Verify user type matches
      if (userData.userType !== userType) {
        toast.error(
          `Login failed! You selected '${userType}', but you are registered as '${userData.userType}'.`
        );
        setIsLoading(false);
        return;
      }

      toast.success("Logged in successfully!");

      // 4. Store user data in local storage
      localStorage.setItem("user", JSON.stringify({
        uid: user.uid,
        email: user.email,
        userType: userData.userType,
        // Add any other relevant user data
      }));

      // 5. Redirect based on user type
      switch (userData.userType) {
        case "admin":
          navigate("/admin");
          break;
        case "doctor":
          navigate("/doctorDashboard");
          break;
        case "patient":
          navigate("/patientDashboard");
          break;
        default:
          navigate("/");
      }

    } catch (error) {
      setIsLoading(false);
      
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case AuthErrorCodes.INVALID_EMAIL:
            toast.error("Invalid Email");
            break;
          case AuthErrorCodes.INVALID_LOGIN_CREDENTIALS:
            toast.error("Invalid Email or Password");
            break;
          case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
            toast.error("Too many attempts. Please try again later.");
            break;
          case AuthErrorCodes.USER_DISABLED:
            toast.error("Account disabled. Please contact support.");
            break;
          default:
            console.error("Firebase auth error:", error);
            toast.error("Login failed. Please try again.");
        }
      } else if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          toast.error("User not found in database");
        } else {
          console.error("Backend error:", error);
          toast.error("Error fetching user data");
        }
      } else {
        console.error("Unknown error:", error);
        toast.error("An unexpected error occurred");
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
            <button 
              type="submit" 
              className="signin-button"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login Now"}
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