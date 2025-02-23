import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import image from "../assets/Oip.jpg";

const Login = () => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // New loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show spinner

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);

        // Redirect based on user role
        if (data.user.role === "Buyer") {
          navigate("/buyer-profile");
        } else if (data.user.role === "Seller") {
          navigate("/seller-profile");
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false); // Hide spinner
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Mobile no"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="login-links">
            <Link to="/forgot-password" className="forgot-link">
              Forgot Password - Reset
            </Link>
          </div>

          {/* Submit button with loading spinner */}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? <div className="spinner"></div> : "Submit"}
          </button>
        </form>

        <p className="register-text">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>

      <div className="login-image">
        <img src={image} alt="Farmer" />
      </div>
    </div>
  );
};

export default Login;
