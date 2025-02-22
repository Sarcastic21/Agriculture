import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import { AiOutlineUser } from "react-icons/ai";
import img2 from "../assets/R.jpg";
import filter from "../assets/filter.png";

function Home() {
  const [startupPosts, setStartupPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState(100);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false); // Toggle sidebar state

  const navigate = useNavigate();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterOpen && !event.target.closest(".filter-sidebar") && !event.target.closest(".filter-toggle-btn")) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filterOpen]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/get-startups`)
    .then((response) => response.json())
    .then((data) => {
      setStartupPosts(data.posts);
      setFilteredPosts(data.posts);
    })
    .catch((error) => console.error("Error fetching posts:", error));
  
  }, []);

  const handleUserClick = (user) => {
    navigate(`/user-profile/${user.id}`, { state: { user } });
  };
  const uniqueCategories = [...new Set(
    (startupPosts || []).flatMap(user => 
      (user.posts || []).flatMap(post => post.category || [])
    )
  )].sort();
  
  const handleCategoryChange = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  const handleCardClick = (post, user) => {
    setSelectedPost({ post, user });
  };

  const handleContactUser = () => {
    if (selectedPost && selectedPost.user) {
      navigate(`/user-profile/${selectedPost.user.id}`, { state: { user: selectedPost.user } });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  // Filtering logic
  const filterPosts = () => {
    const filtered = startupPosts
      .map((user) => ({
        ...user,
        posts: user.posts.filter(
          (post) =>
            post.pricePerKg <= priceFilter &&
            (selectedCategories.length === 0 || 
             post.category.some(cat => selectedCategories.includes(cat))) &&
            post.name.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }))
      .filter((user) => user.posts.length > 0);
  
    setFilteredPosts(filtered);
  };

  useEffect(() => {
    filterPosts();
  }, [priceFilter, selectedCategories, searchQuery]);

 


  const latestPosts = startupPosts.flatMap((user) => user.posts).slice(-3).reverse();

  return (
    <>
    <div className="home-container">
      <div className="hero-image">
        <img src={img2} alt="Hero" />
        <h1 className="hero-text">Welcome to Agritech</h1>
        <input
          type="text"
          placeholder="Search for crops"
          className="searchbar"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      </div>
       <div className="sidebar-container">
      {/* Filter Button */}
      <div className="filter-toggle-btn" onClick={() => setFilterOpen(true)}>
      <img className=" filter-icon" src={filter} alt="" />

      </div>

      {/* Sidebar with Close Button */}
      <div className={`filter-sidebar ${filterOpen ? "open" : ""}`}>
        {/* Close Button */}
        <div className="close-btn2"  onClick={() => setFilterOpen(false)}> X </div>

        <div className="sidebar-header">
          <h3>Filters</h3>
        
        </div>

        {/* Latest Products Section */}
        <div className="products-section">
          <h3>Latest Products</h3>
          {latestPosts.map((post, index) => (
            <div key={`${post.id}-${index}`} className="product-card" onClick={() => handleCardClick(post)}>
              <img src={post.imageLink} alt={post.name} className="product-image" />
              <div className="product-details">
                <p>{post.name}</p>
                <p>Price: {post.pricePerKg} /kg</p>
              </div>
            </div>
          ))}
        </div>

        {/* Price Filter */}
        <div className="price-filter">
          <h3>Filter by Price</h3>
          <input
            type="range"
            min="0"
            max="100"
            value={priceFilter}
            onChange={(e) => setPriceFilter(Number(e.target.value))}
            className="price-slider"
          />
          <p>Max Price: {priceFilter} /kg</p>
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          <h3>Filter by Category</h3>
          {uniqueCategories.map((category) => (
            <div key={category} className="category-item">
              <input
                type="checkbox"
                id={category}
                value={category}
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
              />
              <label htmlFor={category}>{category}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
      <div className="main-container">
        <div className="Left-container">
          <div className="latest-products">
            <h3>Latest Products</h3>
            {latestPosts.map((post, index) => (
  <div key={`${post.id}-${index}`} className="latest-product-card" onClick={() => handleCardClick(post)}>

                <img src={post.imageLink} alt={post.name} className="latest-product-image" />
                <div className="D7">
                  <p>{post.name}</p>
                  <p>Price: {post.pricePerKg} /kg</p>
                </div>
              </div>
            ))}
          </div>

          {/* Price Filter */}
          <div className="filter-section">
            <h3>Filter by Price</h3>
            <input
              type="range"
              min="0"
              max="100"
              value={priceFilter}
              onChange={(e) => setPriceFilter(Number(e.target.value))}
              className="price-slider"
            />
            <p>Max Price: {priceFilter} /kg</p>
          </div>

          {/* Category Filter */}
          <div className="category-filter">
  <h3>Filter by Category</h3>
  {uniqueCategories.map((category) => (
    <div key={category} className="category-item">
      <input
        type="checkbox"
        id={category}
        value={category}
        checked={selectedCategories.includes(category)}
        onChange={() => handleCategoryChange(category)}
      />
      <label htmlFor={category}>{category}</label>
    </div>
  ))}
</div>
        </div>

        <div className="Right-container">
          <div className="startup-ideas">
            <div className="container">
              {filteredPosts.map((user, index) =>
                user.posts.map((post, postIndex) => (
                  <div
                    key={`${index}-${postIndex}`}
                    className="card"
                    onClick={() => handleCardClick(post, user)}
                  >
                    <div className="Profile-navigate">
 <div className="profile-icon-wrapper2">
        {user.profilePhoto ? (
          <img src={`data:image/png;base64,${user.profilePhoto}`} alt="Profile" className="profile-image2" />
        ) : (
            <AiOutlineUser className="profile-image2" />
        )}

        {/* Edit Button */}
       
      </div>                     
                      <h4
                        className="username"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUserClick(user);
                        }}
                      >
                        {user.username}
                      </h4>
                      <button
                        className="view-profile-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUserClick(user);
                        }}
                      >
                        View Profile
                      </button>
                    </div>
                    <img className="image" src={post.imageLink} alt={post.name} />
                    <div className="Price-tittle">
                      <h5 className="title">{post.name}</h5>
                      <h3 className="Price">Price: {post.pricePerKg} /kg</h3>
                    </div>
                  </div>
                ))
              )}
              <hr className="hr" />
            </div>
          </div>

          {selectedPost && (
            <div className="post-description-modal" onClick={(e) => e.target.classList.contains("post-description-modal") && closeModal()}>
              <div className="modal-content">
                <button className="close-btn" onClick={closeModal}>
                  X
                </button>
                <h3>{selectedPost.post.name}</h3>
                <img className="modal-image" src={selectedPost.post.imageLink} alt={selectedPost.post.name} />
                <h3>Price: {selectedPost.post.pricePerKg} /kg</h3>
                <h3>Available Qty: {selectedPost.post.availableQuantity}</h3>
                <p>{selectedPost.post.description}</p>
                <button onClick={handleContactUser} className="view-profile-btn">
                  Contact User to Buy
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      </>
  );
}

export default Home;
