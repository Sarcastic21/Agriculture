import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineHome, AiOutlineDashboard, AiOutlineUser } from "react-icons/ai";
import "../styles/Seller.css";

function BuyerProfile() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("dashboard");
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState("");
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!image) {
      setMessage("Edit Profile");
      return;
    }

    const formData = new FormData();
    formData.append("profilePhoto", image);

    const token = localStorage.getItem("token"); // Assuming token is stored in localStorage


    try {
      const response = await fetch(`${API_BASE_URL}/users/upload-profile-photo`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
    

      const data = await response.json();
      if (response.ok) {
        setMessage("Profile photo uploaded successfully!");
      } else {
        setMessage(data.message || "Upload failed.");
      }
    } catch (error) {
      setMessage("Error uploading photo.");
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "Buyer") {
      navigate("/");
    } else {

fetch(`${API_BASE_URL}/users/profile`, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
  },

      })
        .then((response) => response.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user);
          }
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          navigate("/");
        });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account?");
    if (!confirmDelete) return;
  
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("User not authenticated.");
      return;
    }
  

    try {
      const response = await fetch(`${API_BASE_URL}/users/delete`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    
  
      const data = await response.json();
      if (data.success) {
        alert("Your account has been deleted.");
        localStorage.removeItem("token");
        window.location.href = "/";
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("An error occurred. Please try again.");
    }
  };
  
  

  return (
    <div className="seller-page-container">
      <div className="sidebar">
      <div className="profile-section">
  <div className="profile-container">
       {/* Profile Icon */}
       <div className="profile-icon-wrapper">
         {user.profilePhoto ? (
           <img src={`data:image/png;base64,${user.profilePhoto}`} alt="Profile" className="profile-image" />
         ) : (
             <AiOutlineUser className="default-icon " />
         )}
 
         {/* Edit Button */}
         <label htmlFor="profile-upload" className="edit-icon">
           ✏️
         </label>
         <input type="file" id="profile-upload" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
       </div>
 
       {/* Show Upload Button Only After Selecting a File */}
       {image && <button className="upload-btn" onClick={handleUpload}>Upload</button>}
 
       <p className="message">{message}</p>
     </div>
  <p className="user-name">{user.name || "N/A"}</p>
  <p className="user-email">{user.email || "N/A"}</p>
</div>


        <div className="menu">
          <button onClick={() => navigate("/home")} className="menu-btn">
             Home
          </button>
          <button onClick={() => setActiveView("dashboard")} className="menu-btn">
             Dashboard
          </button>
          <button onClick={handleLogout} className="menu-btn">
            Logout
          </button>
          <button onClick={handleDeleteAccount} className=" menu-btn delete-btn">
            Delete My Account
          </button>
        </div>
      </div>

      <div className="content">
        {activeView === "dashboard" && (
          <div className="contact-text" >
            <h2 className="product-heading">Your Details</h2>
            <span className="contact-text">
            <p className="info-link"><strong>Name:</strong> {user.name || "N/A"}</p>
           </span>
           <span className="contact-text">

            <p className="info-link"><strong>Email:</strong> {user.email || "N/A"}</p>
            </span>

           
            <span className="contact-text">

            <p className="info-link"><strong>Mobile Number:</strong> {user.mobile || "N/A"}</p>
            </span>

          </div>
        )}
      </div>
    </div>
  );
}

export default BuyerProfile;
