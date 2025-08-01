import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../css/Navbar.css";

const Navbar = ({ user, setUser }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setShowDropdown(false);
    navigate("/");
  };

  console.log("Navbar received user:", user); // Debug log

  return (
    <nav className="navbar">
      <div className="navbar-logo">FlavorFindr</div>
      <div className="navbar-links">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          About
        </NavLink>
        <NavLink
          to="/recipes"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Recipes
        </NavLink>
        <NavLink
          to="/saved"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Saved
        </NavLink>
      </div>
      <div className="navbar-user">
        {user ? (
          <div className="user-menu">
            <div
              className="user-icon"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#aaa"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M21 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
              </svg>
            </div>
            {showDropdown && (
              <div className="user-dropdown">
                <div className="dropdown-username">
                  <span>{user.username}</span>
                </div>
                <button onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <NavLink to="/login" className="user-icon">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#aaa"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M21 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
            </svg>
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
