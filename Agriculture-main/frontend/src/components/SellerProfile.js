import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineHome, AiOutlineDashboard, AiOutlineUser } from "react-icons/ai";
import "../styles/Seller.css";

function SellerProfile() {
  const [user, setUser] = useState({});
  const [startup, setStartup] = useState({
    name: "",
    imageLink: "",
    description: "",
    pricePerKg: "",
    availableQuantity: "",
    category: [], // Store selected categories
  });
  const [query, setQuery] = useState({
   queryPosts:"", // Add available quantity
  });
  const [queryPosts, setQueryPosts] = useState([]);

  const [startupPosts, setStartupPosts] = useState([]);
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("posts");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
  
    if (file) {
      const maxSize = 2 * 1024 * 1024; // 2MB (Adjust as needed)
  
      if (file.size > maxSize) {
        alert("Image size is too large! Please upload an image smaller than 2MB.");
        return;
      }
  
      const reader = new FileReader();
      reader.onloadend = () => {
        setStartup(prev => ({
          ...prev,
          imageLink: reader.result // Base64 string
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  

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
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/upload-profile-photo`, {
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
  const navigateToHome = () => {
    navigate("/home");
  };
  const openModal = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setIsModalOpen(false);
  };
  useEffect(() => {
    // Fetch token and role from localStorage
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "Seller") {
      // Redirect to login page if not logged in or if role is not "Seller"
      navigate("/");
    } else {
      fetch(`${process.env.REACT_APP_API_BASE_URL}/users/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
     
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user); // Set user details
            setStartupPosts(data.user.startupPosts); // Set the user's startup posts
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

  const handleInputChange = (e) => {
    setStartup({
      ...startup,
      [e.target.name]: e.target.value,
    });
  };

  const handleInputChange2 = (e) => {
    setQuery({
      ...query,
      [e.target.name]: e.target.value,
    });
  };
  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setStartup((prev) => ({
      ...prev,
      category: checked
        ? [...prev.category, value] // Add category if checked
        : prev.category.filter((cat) => cat !== value), // Remove if unchecked
    }));
  };

  const handlePostStartup = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/post-startup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(startup),
    })
     
      .then((response) => response.json())
      .then((data) => {
        if (data.post) {
          setStartupPosts([...startupPosts, data.post]);
          setStartup({
            name: "",
            imageLink: "",
            description: "",
            pricePerKg: "",
            availableQuantity: "",
            category: [],
          });
        }
      })
      .catch((error) => console.error("Error posting startup:", error));
  };


  const handlePostQuery = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/post-query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
   
      body: JSON.stringify(query),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.post) {
          setQueryPosts([...queryPosts, data.post]);
          setQuery({ queryPosts:"" });
        }
      })
      .catch((error) => console.error("Error posting startup:", error));
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
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
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
            <AiOutlineUser className="default-icon" />
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


        {/* In the menu buttons section */}
<div className="menu">
  <button onClick={navigateToHome} className="menu-btn">
   Home
  </button>
  <button 
    onClick={() => setActiveView("dashboard")} 
    className={`menu-btn ${activeView === "dashboard" ? "active" : ""}`}
  >
     Dashboard
  </button>
  <button 
    onClick={() => setActiveView("posts")} 
    className={`menu-btn ${activeView === "posts" ? "active" : ""}`}
  >
    My Posts
  </button>
  <button 
    onClick={() => setActiveView("query")} 
    className={`menu-btn ${activeView === "query" ? "active" : ""}`}
  >
    Query
  </button>
  <button onClick={handleLogout} className="menu-btn">
    Logout
  </button>
  <button onClick={handleDeleteAccount} className="menu-btn delete-btn">
    Delete My Account
  </button>
</div>
      </div>

      <div className="content">
        {activeView === "dashboard" && (
          <div className="post-form">
            <h2 className="product-heading" > Post</h2>
            <form onSubmit={handlePostStartup}>
      <input
        type="text"
        name="name"
        value={startup.name}
        onChange={handleInputChange}
        placeholder="Name"
        required
      />
  <input
  type="file"
  accept="image/*"
  onChange={handleImageUpload}
  name="imageLink"
  required
  
/>

      <textarea
        name="description"
        value={startup.description}
        onChange={handleInputChange}
        placeholder="Description"
        required
      />
      <input
        type="number"
        name="pricePerKg"
        value={startup.pricePerKg}
        onChange={handleInputChange}
        placeholder="Price per kg"
        required
      />
      <input
        type="number"
        name="availableQuantity"
        value={startup.availableQuantity}
        onChange={handleInputChange}
        placeholder="Available Quantity"
        required
      />

      {/* Category Checkboxes */}
      <div className="category-filter2">
        <label>
          <input
          placeholder="Fruits"
            type="checkbox"
            value="Fruits"
            checked={startup.category.includes("Fruits")}
            onChange={handleCategoryChange}
          />
          Fruits
        </label>
        <label>
          <input
            type="checkbox"
            value="Vegetables"
            checked={startup.category.includes("Vegetables")}
            onChange={handleCategoryChange}
          />
          Vegetables
        </label>
        <label>
          <input
            type="checkbox"
            value="Grains"
            checked={startup.category.includes("Grains")}
            onChange={handleCategoryChange}
          />
          Grains
        </label>
      </div>

      <button type="submit" className="post-btn">
        Post
      </button>
    </form>
          </div>
        )}

        {activeView === "posts" && (
          
          <div className="posts-container">
            {startupPosts.length === 0 ? (
              <p>No posts available</p>
            ) : (
              startupPosts.map((post, index) => (
                <div key={index} 
                className="post-card"
                onClick={() => openModal(post)}>
                  <img className="post-image" src={post.imageLink} alt={post.name} />

                  <div className="Price-tittle">
                <h5 className="title2">{post.name}</h5>
                <h3 className="Price">  Price: {post.pricePerKg} /kg</h3>
                </div>
                </div>
              ))
            )}
          </div>
        )}


{activeView === "query" && (
          <div className="post-form">
            <h2 className="product-heading" >Post Query</h2>
            <form onSubmit={handlePostQuery}>
             
              <textarea
                name="queryPosts"
                value={query.queryPosts}
                onChange={handleInputChange2}
                placeholder="write your query"
                required
              />
              
              <button type="submit" className="post-btn">
                Post
              </button>
            </form>
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
      <h2>{selectedPost.name}</h2>
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

export default SellerProfile;
