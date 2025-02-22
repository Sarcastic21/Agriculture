import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Navbar.css";
import { AiOutlineUser } from "react-icons/ai";
import Logo10 from "../assets/Logo10.jpg";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null); // Reference for menu div

  const handleDashboardClick = () => {
    const token = localStorage.getItem("token");

    if (token) {
      const userRole = localStorage.getItem("role");

      if (userRole === "Buyer") {
        navigate("/buyer-profile");
      } else if (userRole === "Seller") {
        navigate("/seller-profile");
      } else {
        console.error("User role is undefined or invalid.");
        navigate("/");
      }
    } else {
      alert("Please log in first.");
      navigate("/register");
    }
  };

  const isLoggedIn = Boolean(localStorage.getItem("token"));

  // Close menu only when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="logo9">
          <img
            src={Logo10}
            alt="Logo"
            className="nav-logo"
            onClick={() => navigate("/home")}
          />
          <h1 className="logo">Agritech</h1>
        </div>

        <div className="nav-buttons">
          <span
            onClick={handleDashboardClick}
            className={`navbar-link ${!isLoggedIn ? "disabled-link" : ""}`}
            style={{
              cursor: isLoggedIn ? "pointer" : "not-allowed",
              opacity: isLoggedIn ? "1" : "0.5",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <AiOutlineUser size={30} />
          </span>
          <div
            className="hamburger-icon"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            ☰
          </div>
        </div>
      </nav>

      {/* Navigation Menu */}
      <nav className="d09">
        <div ref={menuRef} className={`nav-buttons1 ${menuOpen ? "open" : ""}`}>
          <Link to="/home" className="navbar-link1" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/community" className="navbar-link1" onClick={() => setMenuOpen(false)}>Community</Link>
          <Link to="/weather" className="navbar-link1" onClick={() => setMenuOpen(false)}>
            <span className="weather-icon"></span> Weather
          </Link>
          <span
            onClick={() => {
              handleDashboardClick();
              setMenuOpen(false);
            }}
            className={`navbar-link1 ${!isLoggedIn ? "disabled-link" : ""}`}
            style={{
              cursor: isLoggedIn ? "pointer" : "not-allowed",
              opacity: isLoggedIn ? "1" : "0.5",
            }}
          >
            Dashboard
          </span>
          <Link to="/Ai" className="navbar-link1" onClick={() => setMenuOpen(false)}>Ai ✨</Link>
        </div>
      </nav>

      {/* Desktop Navigation */}
      <nav>
        <div className="nav-buttons2">
          <Link to="/home" className="navbar-link2">Home</Link>
          <Link to="/community" className="navbar-link2">Community</Link>
          <Link to="/weather" className="navbar-link2">
            <span className="weather-icon"></span> Weather
          </Link>
          <span
            onClick={handleDashboardClick}
            className={`navbar-link2 ${!isLoggedIn ? "disabled-link" : ""}`}
            style={{
              cursor: isLoggedIn ? "pointer" : "not-allowed",
              opacity: isLoggedIn ? "1" : "0.5",
            }}
          >
            Dashboard
          </span>
          <Link to="/Ai" className="navbar-link2">Ai ✨</Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
