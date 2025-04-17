import React, { useState, useContext } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import img from "../Images/doctor.png";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return setError("Please fill in all fields");
    }

    try {
      setError("");
      setLoading(true);

      const data = await login(email, password);
      toast.success("Login successful!");

      switch (data.user.role) {
        case "user":
          navigate("/user/dashboard");
          break;
        case "doctor":
          navigate("/doctor/dashboard");
          break;
        case "admin":
          navigate("/admin/dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left Side - Form */}
      <div className="login-left">
        <div className="login-form-container">
          <div className="login-title">
            <h1>Login</h1>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100 mt-3"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Form>

          <div className="text-center mt-3 login-footer">
            <p>
              Don't have an account?{" "}
              <Link to="/register" className="signup-link">
                Register
              </Link>
            </p>
          </div>
        </div>
        <ToastContainer />
      </div>

      {/* Right Side - Image/Welcome */}
      <div className="login-right">
        <div className="login-right-content">
          <h2>Welcome Back</h2>
          <p>Login to your account</p>
          <div className="login-icon">
            <img src={img} alt="doctor" className="rounded-xl" loading="lazy" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
