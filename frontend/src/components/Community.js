import React, { useEffect, useState } from "react";
import { User } from "lucide-react";
import "../styles/community.css";

const Community = () => {
  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/get-all-queries`)
      .then((response) => response.json())
      .then((data) => {
        const sortedQueries = data.queries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setQueries(sortedQueries);
      })
      .catch((error) => console.error("Error fetching queries:", error));
  }, []);
  

  const handleReplySubmit = async () => {
    if (!selectedQuery || !replyText.trim()) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/post-reply/${selectedQuery}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyText }),
      });

      if (response.ok) {
        const updatedQueries = queries.map((query) =>
          query.queryId === selectedQuery
            ? { ...query, replies: [...query.replies, { replyText, createdAt: new Date() }] }
            : query
        );
        setQueries(updatedQueries);
        setReplyText("");
      }
    } catch (error) {
      console.error("Error posting reply:", error);
    }
  };

  const handleMobileReplyClose = () => {
    setIsMobilePanelOpen(false);
    setSelectedQuery(null);
  };

  return (
    <div className="community-container">
      <h1 className="community-title">Community Queries</h1>

      <div className="community-content">
        {/* Queries List */}
        <div className="left-div">
          <h2>All Queries</h2>
          {queries.map((query) => (
            <div
              key={query.queryId}
              className={`query-card ${selectedQuery === query.queryId ? "selected" : ""}`}
              onClick={() => {
                setSelectedQuery(query.queryId);
                if (window.innerWidth <= 768) setIsMobilePanelOpen(true);
              }}
            >
              <div className="query-header">
                <User className="profile-icon" />
                <div className="query-meta">
                  <h3 className="query-name">{query.name}</h3>
                  <small className="query-date">
                    {new Date(query.createdAt).toLocaleDateString()}
                  </small>
                </div>
                <div className="reply-indicator">
                  <span>{query.replies?.length || 0} replies</span>
                  <button 
                    className="mobile-reply-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedQuery(query.queryId);
                      setIsMobilePanelOpen(true);
                    }}
                  >
                    💬
                  </button>
                </div>
              </div>
              <p className="query-text">{query.queryText}</p>
            </div>
          ))}
        </div>

        {/* Desktop Replies Section */}
        <div className="right-div">
          {selectedQuery ? (
            <>
              <h2>Replies</h2>
              <div className="replies-list">
                {queries
                  .find((q) => q.queryId === selectedQuery)
                  ?.replies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((reply, index) => (
                    <div key={index} className="reply-card">
                      <p className="reply-text">{reply.replyText}</p>
                      <small className="reply-date">
                        {new Date(reply.createdAt).toLocaleString()}
                      </small>
                    </div>
                  ))}
              </div>
              <div className="reply-input">
                <input
                  type="text"
                  placeholder="Write your reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleReplySubmit()}
                />
                <button 
                  onClick={handleReplySubmit}
                  className="reply-submit-button"
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="no-query-selected">
              <p>Select a query to view replies</p>
            </div>
          )}
        </div>

        {/* Mobile Replies Panel */}
        <div className={`mobile-replies-panel ${isMobilePanelOpen ? "open" : ""}`}>
          <div className="panel-header">
            <button className="close-button" onClick={handleMobileReplyClose}>
              &times;
            </button>
            <h3>Replies</h3>
          </div>
          <div className="panel-content">
            {queries
              .find((q) => q.queryId === selectedQuery)
              ?.replies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((reply, index) => (
                <div key={index} className="reply-card">
                  <p className="reply-text">{reply.replyText}</p>
                  <small className="reply-date">
                    {new Date(reply.createdAt).toLocaleString()}
                  </small>
                </div>
              ))}
            <div className="reply-input">
              <input
                type="text"
                placeholder="Write your reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleReplySubmit()}
              />
              <button 
                onClick={handleReplySubmit}
                className="reply-submit-button"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;