import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import image from "../assets/Oip.jpg"; 

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    role: 'Buyer',
  });
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);  // Loading state for sending OTP
  const [loadingVerify, setLoadingVerify] = useState(false); // Loading state for verifying OTP
  const navigate = useNavigate();

  const handleRoleChange = (role) => {
    setFormData({ ...formData, role });
  };

  const sendOtp = async () => {
    setLoadingOtp(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/send-otp2`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
    

      const data = await response.json();
      if (response.ok) {
        setOtpSent(true);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
    } finally {
      setLoadingOtp(false);
    }
  };

  const verifyOtp = async () => {
    setLoadingVerify(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp }),
      });
   
    

      const data = await response.json();
      if (response.ok) {
        setIsOtpVerified(true);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
    } finally {
      setLoadingVerify(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isOtpVerified) {
      alert('Please verify OTP first.');
      return;
    }

    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    
    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      navigate(data.user.role === 'Buyer' ? '/buyer-profile' : '/seller-profile');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          <input type="text" placeholder="Mobile no" value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} required />
          <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />

          <div className="checkbox-container">
            <label className="checkbox-label">
              <input type="radio" name="role" value="Buyer" checked={formData.role === 'Buyer'} onChange={() => handleRoleChange('Buyer')} />
              Invester
            </label>
            <label className="checkbox-label">
              <input type="radio" name="role" value="Seller" checked={formData.role === 'Seller'} onChange={() => handleRoleChange('Seller')} />
              User
            </label>
          </div>

          {otpSent && !isOtpVerified && (
            <div>
              <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
              <button type="button" className="submit-btn" onClick={verifyOtp} disabled={loadingVerify}>
                {loadingVerify ? <span className="spinner"></span> : 'Verify OTP'}
              </button>
            </div>
          )}

          {!otpSent && (
            <button type="button" className="submit-btn" onClick={sendOtp} disabled={loadingOtp}>
              {loadingOtp ? <span className="spinner"></span> : 'Send OTP to Email'}
            </button>
          )}

          {isOtpVerified && (
            <button type="submit" className="submit-btn">
              Register
            </button>
          )}
        </form>

        <div className="register-text">
          Already have an account?{' '}
          <a href="/" onClick={() => navigate('/')}>
            Login here
          </a>
        </div>
      </div>
      <div className="login-image">
        <img src={image} alt="Illustration" />
      </div>
    </div>
  );
};

export default Register;
