import { Link, useNavigate } from "react-router-dom";
import { type FormEvent, useState } from "react";
import img from "../../images/doctor.png";
import OAuth from "../Login/oauth";
import {
  AuthErrorCodes,
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { db } from "../../firebaseConfig";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import { FirebaseError } from "firebase/app";
import "./Signup.css"; // Import CSS file

export default function Signup() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredentials.user;

      await updateProfile(user, { displayName: name });

      // Save user in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        createdAt: serverTimestamp(),
      });

      toast.success("User Created Successfully!");
      navigate("/signin");
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error?.code) {
          case AuthErrorCodes.EMAIL_EXISTS:
            toast.error("Email already in use");
            break;
          default:
            toast.error("Something went wrong with the registration");
            break;
        }
      }
    }
  };

  return (
    <div className="signup-container">
      {/* Left Section */}
      <div className="signup-left">
        <div className="signup-left-content">
          <h2>Welcome</h2>
          <p>Join us today!</p>
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

      {/* Right Section */}
      <div className="signup-right">
        <div className="signup-form-container">
          <div className="signup-logo">
            <span className="font-semibold">
              <span className="text-purple">PA</span> &{" "}
              <span className="text-green">QMS</span>
            </span>
          </div>

          <div className="signup-title">
            <h1>CREATE ACCOUNT</h1>
          </div>

          <form onSubmit={onSubmit} className="signup-form">
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

            <button type="submit" className="signup-button">
              Signup
            </button>

            <div className="signup-divider">
              <span className="divider-text">SignUp with Others</span>
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
