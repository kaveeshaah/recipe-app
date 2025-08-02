import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import showPasswordIcon from "../icons/showpassword.png";
import "../css/login.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: formData.password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      alert(
        "Password reset successful! You can now login with your new password."
      );
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="login-bg">
      <div className="login-flavorfindr-brand">FlavorFindr</div>
      <div className="login-form-container">
        <h2 className="login-title">Reset Password</h2>
        <p className="login-subtitle">Enter your new password below.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <label htmlFor="password">New Password*</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={error ? "input-error" : ""}
              required
              disabled={loading}
              minLength="6"
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

          <label htmlFor="confirmPassword">Confirm New Password*</label>
          <div className="password-input-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={error ? "input-error" : ""}
              required
              disabled={loading}
              minLength="6"
            />
            <span
              className="toggle-password"
              onClick={toggleConfirmPasswordVisibility}
            >
              <img
                src={showPasswordIcon}
                alt={showConfirmPassword ? "Hide password" : "Show password"}
              />
            </span>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "RESETTING..." : "RESET PASSWORD"}
          </button>

          <p className="register-link">
            Remember your password? <Link to="/login">Back to Login</Link>
          </p>
        </form>
      </div>
      <div className="login-bg-image" />
    </div>
  );
};

export default ResetPassword;
