import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import showPasswordIcon from "../icons/showpassword.png";
import "../css/login.css";

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      const userData = {
        username: data.username,
        token: data.token,
        userId: data.userId,
      };
      setUser(userData, true); // Pass true to indicate this is a login
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-bg">
      <div className="login-flavorfindr-brand">FlavorFindr</div>
      <div className="login-form-container">
        <h2 className="login-title">Welcome Back, Chef!</h2>
        <p className="login-subtitle">
          Log in and cook up something delicious.
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <label htmlFor="email">Email/Username*</label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={error ? "input-error" : ""}
            required
          />

          <label htmlFor="password">Password*</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={error ? "input-error" : ""}
              required
            />
            <span
              className="toggle-password"
              onClick={togglePasswordVisibility}
            >
              <img
                src={showPasswordIcon}
                alt={showPassword ? "Hide password" : "Show password"}
              />
            </span>
          </div>

          <Link to="/forgot-password" className="forgot-password">
            Forgot Password?
          </Link>

          <button type="submit" className="login-btn">
            LOGIN
          </button>

          <p className="register-link">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </form>
      </div>
      <div className="login-bg-image" />
    </div>
  );
};

export default Login;
