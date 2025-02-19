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
        const userType = userData.userType;

        toast.success("Logged in Successfully!");

        // Redirect user based on type
        switch (userType) {
          case "admin":
            navigate("/admin-dashboard");
            break;
          case "doctor":
            navigate("/doctor-dashboard");
            break;
          case "patient":
            navigate("/patient-dashboard");
            break;
          default:
            navigate("/dashboard");
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
            <div>
              <input
                type="email"
                className="input-field"
                placeholder="Username"
                value={email}
                name="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="password-container">
              <input
                type={seePassword ? "text" : "password"}
                autoComplete="off"
                className="input-field"
                placeholder="Password"
                value={password}
                name="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <div
                className="eye-icon"
                onClick={() => setSeePassword((prev) => !prev)}
              >
                {seePassword ? <FaEyeSlash /> : <FaRegEye />}
              </div>
            </div>

            <button type="submit" className="signin-button">
              Login Now
            </button>

            <div className="divider">Login with Others</div>

            <OAuth />

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
