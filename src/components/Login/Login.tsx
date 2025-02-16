import React from "react";
import { useForm } from "react-hook-form";
import "./Login.css";

type FormData = {
  username: string;
  password: string;
};

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log("Login Data:", data);
    // Integrate Authentication Logic Here
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-left">
          <h1>LOGIN</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Username"
                {...register("username", { required: "Username is required" })}
              />
              {errors.username && <p className="error">{errors.username.message}</p>}
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && <p className="error">{errors.password.message}</p>}
            </div>

            <button type="submit" className="login-button">Login Now</button>
          </form>

          <div className="social-login">
            <p>Login with Others</p>
            <button className="google-login">Login with Google</button>
            <button className="facebook-login">Login with Facebook</button>
          </div>

          <p className="signup-text">
            Don't have an account? <a href="#">Sign Up</a>
          </p>
        </div>

        <div className="login-right">
          <div className="image-box">
            <h2>Thank you for choosing us.</h2>
            <img src="/doctor.png" alt="Doctor" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
