import React from "react";
import { Link } from "react-router-dom";
import "../css/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">Quick Access</h3>
          <nav className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/recipes">Recipes</Link>
            <Link to="/saved">Saved</Link>
          </nav>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">More</h3>
          <nav className="footer-links">
            <Link to="/faq">FAQ</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </nav>
        </div>

        <div className="footer-section">
          <div className="footer-brand">
            <h2 className="footer-logo">FLAVOURFINDR</h2>
            <p className="footer-email">flavourfindr@gmail.com</p>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 FlavorFindr all right reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
