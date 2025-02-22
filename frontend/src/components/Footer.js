import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/Footer.css";
import Logo10 from "../assets/Logo10.jpg";

function Footer() {
  return (
    <footer className="footer-container">
      {/* First Column - First 3 Links */}
      <div className="footer-links">
        <h4>Quick Links</h4>
        <ul>
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/Ai">AI</Link></li>
          <li><Link to="/forgot-password">Forgot Password</Link></li>
        </ul>
      </div>

      {/* Second Column - Last 2 Links */}
      <div className="footer-links">
        <h4>About</h4>
        <ul>
          <h3>
            Sell and buy the crops at best prices 
          </h3>
          <h3>
            since 2025
          </h3>
        </ul>
      </div>

      {/* Third Column - Logo and Farmer Choice */}
      <div className="footer-links" >
      <h4>Agritech</h4>

        <img src={Logo10} alt="Farmer Choice Logo" className="footer-image" />
      </div>
    </footer>
  );
}

export default Footer;
