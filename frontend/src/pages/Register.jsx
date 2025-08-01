import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import showPasswordIcon from "../icons/showpassword.png";
import "../css/Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName) newErrors.fullName = "Full name is required.";
    if (!form.email) newErrors.email = "Email is required.";
    if (!form.username) newErrors.username = "Username is required.";
    if (!form.password) newErrors.password = "Password is required.";
    if (!form.confirmPassword)
      newErrors.confirmPassword = "Confirm your password.";
    if (
      form.password &&
      form.confirmPassword &&
      form.password !== form.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: form.username,
            email: form.email,
            password: form.password,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          setSuccessMessage("Registration successful! Redirecting to login...");
          setForm({
            fullName: "",
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
          });
          setSubmitted(false);
          // Navigate to login page after showing success message
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          setErrors({
            ...errors,
            backend: data.message || "Registration failed.",
          });
        }
      } catch (err) {
        setErrors({ ...errors, backend: "Network error. Please try again." });
      }
    }
  };

  return (
    <div className="register-bg">
      <div className="flavorfindr-brand">FlavorFindr</div>
      {/* Toast notification */}
      {successMessage && (
        <div className="toast-notification">{successMessage}</div>
      )}
      <div className="register-form-container">
        <h2 className="register-title">Let's Get Cooking!</h2>
        <p className="register-subtitle">
          Create your account and start your flavorful journey.
        </p>
        <form className="register-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="fullName">Full Name*</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            className={errors.fullName && submitted ? "input-error" : ""}
            required
          />
          {errors.fullName && submitted && (
            <div className="error-message">{errors.fullName}</div>
          )}

          <label htmlFor="email">Email Address*</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className={errors.email && submitted ? "input-error" : ""}
            required
          />
          {errors.email && submitted && (
            <div className="error-message">{errors.email}</div>
          )}

          <label htmlFor="username">Username*</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className={errors.username && submitted ? "input-error" : ""}
            required
          />
          {errors.username && submitted && (
            <div className="error-message">{errors.username}</div>
          )}

          <label>Password*</label>
          <div className="register-form-row">
            <div className="password-input-wrapper">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className={errors.password && submitted ? "input-error" : ""}
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword((v) => !v)}
              >
                <img src={showPasswordIcon} alt="Show Password" />
              </span>
              {errors.password && submitted && (
                <div className="error-message">{errors.password}</div>
              )}
            </div>

            <div className="password-input-wrapper">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className={
                  errors.confirmPassword && submitted ? "input-error" : ""
                }
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowConfirmPassword((v) => !v)}
              >
                <img src={showPasswordIcon} alt="Show Password" />
              </span>
              {errors.confirmPassword && submitted && (
                <div className="error-message">{errors.confirmPassword}</div>
              )}
            </div>
          </div>
          {errors.backend && (
            <div className="error-message">{errors.backend}</div>
          )}

          <button type="submit" className="register-btn">
            Register
          </button>
        </form>
      </div>
      <div className="register-bg-image" />
    </div>
  );
};

export default Register;
