import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/login.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset email");
      }

      // Show success message based on environment
      if (data.debug && data.debug.mode === "simulation") {
        setMessage(
          `Password reset request sent successfully! 🎉
          
          Since you're in development mode, check the browser console for the reset link to test the functionality.`
        );
      } else {
        setMessage(
          "Password reset email sent! Check your inbox and spam folder."
        );
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-flavorfindr-brand">FlavorFindr</div>
      <div className="login-form-container">
        <h2 className="login-title">Forgot Password?</h2>
        <p className="login-subtitle">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}

          <label htmlFor="email">Email Address*</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={error ? "input-error" : ""}
            required
            disabled={loading}
          />

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "SENDING..." : "SEND RESET EMAIL"}
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

export default ForgotPassword;
