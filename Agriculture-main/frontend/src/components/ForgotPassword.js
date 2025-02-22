import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Login.css"; // Import the same CSS file for styling
import image from "../assets/Oip.jpg"; // Correct path to your assets folder

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }), // Send the entered email to the backend
    });
    
    const data = await response.json();
    if (data.success) {
      alert("OTP sent to your email.");
      setStep(2);
    } else {
      alert(data.message);
    }
  };
  

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/users/forgot-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      }
    );
    
    const data = await response.json();
    if (data.success) {
      alert("Password updated successfully.");
      window.location.href = "/login";
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>{step === 1 ? "Forgot Password" : "Reset Your Password"}</h2>
        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="submit-btn">
              Send OTP
            </button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleResetPassword}>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="submit" className="submit-btn">
              Reset Password
            </button>
          </form>
        )}
        <div className="login-links">
          <Link to="/" className="forgot-link">Back to Login</Link>
        </div>
      </div>
      <div className="login-image">
        <img src={image} alt="Farmer" />
      </div>
    </div>
  );
};

export default ForgotPassword;
