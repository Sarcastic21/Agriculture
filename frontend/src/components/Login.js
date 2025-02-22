import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // We need `useNavigate` to redirect
import "../styles/Login.css";
import image from "../assets/Oip.jpg"; // Correct path to your assets folder

const Login = () => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Hook to navigate programmatically

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Send login credentials to the backend
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile, password }),
    });
    

    const data = await response.json();

    if (response.ok) {
      // Store the JWT token and role in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role); // Save role in localStorage

      // Redirect based on user role
      if (data.user.role === "Buyer") {
        navigate("/buyer-profile"); // Navigate to Buyer profile page
      } else if (data.user.role === "Seller") {
        navigate("/seller-profile"); // Navigate to Seller profile page
      }
    } else {
      alert(data.message); // Show error message if login fails
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
            <Link to="/forgot-password" className="forgot-link">Forgot Password  -  Reset</Link>
          </div>
          <button type="submit" className="submit-btn">Submit</button>
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
