import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/register";
import ForgotPassword from "./components/ForgotPassword";
import BuyerProfile from "./components/Buyerprofile";
import SellerProfile from "./components/SellerProfile";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Footer from "./components/Footer";

import UserProfile from "./components/UserProfile";
import Main from "./components/main";
import Community from "./components/Community";
import Weather from "./components/Weather";

function App() {
  return (
    <Router>
      <Navbar/>
        <Routes>
          {/* Route for Login Page */}
          <Route path="/" element={<Login />} />
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          <Route path="/community" element={<Community />} />

          {/* Route for Registration Page */}
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/Ai" element={<Main/>} />
          <Route path="/weather" element={<Weather/>} />

          {/* Route for Forgot Password Page */}
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Route for Buyer Profile Page */}
          <Route path="/buyer-profile" element={<BuyerProfile />} />

          {/* Route for Seller Profile Page */}
          <Route path="/seller-profile" element={<SellerProfile />} />
        </Routes>
        <Footer/>
    </Router>
  );
}

export default App;
