import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaPhoneAlt, FaUserCircle } from "react-icons/fa";
import "../styles/UserProfile.css";
import {  AiOutlineUser } from "react-icons/ai";

function UserProfile() {
  const location = useLocation();
  const user = location.state?.user;
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("products"); // Track which section to display
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  if (!user) {
    return <div>User not found</div>;
  }

  const openModal = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setIsModalOpen(false);
  };

  const handleChat = () => {
    if (user.mobile) {
      const whatsappUrl = `https://wa.me/${user.mobile}`;
      window.open(whatsappUrl, "_blank");
    } else {
      alert("Mobile number not available for WhatsApp chat.");
    }
  };
  
  

  return (
    <div className="profile-page">
      <div className="sidebar">
         <div className="profile-section">
 <div className="profile-container">
      {/* Profile Icon */}
      <div className="profile-icon-wrapper">
        {user.profilePhoto ? (
          <img src={`data:image/png;base64,${user.profilePhoto}`} alt="Profile" className="profile-image" />
        ) : (
            <AiOutlineUser className="default-icon" />
        )}

        
      </div>


    </div>                 
     <p className="user-name">{user.username || "N/A"}</p>
                
         </div>
        <button
          className={`menu-btn ${activeTab === "products" ? "active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          Products by {user.username}
        </button>
        <button
          className={`menu-btn ${activeTab === "details" ? "active" : ""}`}
          onClick={() => setActiveTab("details")}
        >
          Contact
        </button>
        
        <button className="menu-btn" onClick={handleChat}>
          Chat
        </button>
      </div>

      <div className="content">
      {activeTab === "products" && (
          <div className="products-section">
     <h2 className="product-heading">Products by {user.username}</h2>

            <div className="posts-container">
              {user.posts.map((post, index) => (
                <div
                  key={index}
                  className="post-card"
                  onClick={() => openModal(post)}
                >
                  <img
                    className="post-image"
                    src={post.imageLink}
                    alt={post.name}
                  />
                  <div className="Price-tittle">
                <h5 className="title2">{post.name}</h5>
                <h3 className="Price">  Price: {post.pricePerKg} /kg</h3>
                </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === "details" && (
          
          <div className="contact-cards">
  <div className="contact-card">
    <img src="https://media.gettyimages.com/id/1203015015/vector/newsletter-planning-gradient-color-papercut-style-icon-design.jpg?s=612x612&w=0&k=20&c=D2AMtAQOJab2XZmpBC9JkioXpdA_VETmNqokSPzbWtk=" alt="Email Icon" className="contact-icon" />
    <span className="contact-text">
      <strong>Mail us anytime</strong>
      <Link to={`mailto:${user.email}`} className="info-link">
        {user.email}
      </Link>
    </span>
  </div>
  
  <div className="contact-card">
    <img src="https://logodix.com/logo/510912.jpg" alt="Phone Icon" className="contact-icon" />
    <span className="contact-text">
      <strong>Call us anytime </strong>
      <Link to={`tel:${user.mobile}`} className="info-link">
        {user.mobile}
      </Link>
    </span>
  </div>
</div>

        )}

       
      </div>

      {isModalOpen && selectedPost && (
  <div
    className="modal"
    onClick={(e) => {
      if (e.target.classList.contains("modal")) {
        closeModal();
      }
    }}
  >
    <div className="modal-content">
      <button className="close-btn" onClick={closeModal}>
      X
      </button>
      <h4>{selectedPost.name}</h4>
      <img
        className="modal-image"
        src={selectedPost.imageLink}
        alt={selectedPost.name}
      />
      <h3>Price: {selectedPost.pricePerKg}/kg</h3>
      <h3>Available Qty: {selectedPost.availableQuantity}</h3>
      <p>{selectedPost.description}</p>
    </div>
  </div>
)}

    </div>
  );
}

export default UserProfile;
