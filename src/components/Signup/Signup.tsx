import React, { useState } from "react";
import "./Signup.css";

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <div className="signup-message">
          <img src="/stethoscope.png" alt="Stethoscope" className="stethoscope-img" />
          <p>Thank you for Trusting us.</p>
        </div>
      </div>
      <div className="signup-right">
        <h2>CREATE ACCOUNT</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="signup-btn">Signup</button>
        </form>
        <p className="or">SignUp with Others</p>
        <div className="social-buttons">
          <button className="google-btn">Login with Google</button>
          <button className="facebook-btn">Login with Facebook</button>
        </div>
        <p className="login-link">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
