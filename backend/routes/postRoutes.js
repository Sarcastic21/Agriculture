// routes/usersRoutes.js
import express from "express";
import verifyToken  from "../middleware/auth.js"; // Ensure the correct file extension
import User from "../models/UserModel.js";

const router = express.Router();

// Add your routes here...



// POST route for adding startup ideas
router.post('/post-startup', verifyToken, async (req, res) => {
  const { name, imageLink, description, pricePerKg, availableQuantity, category } = req.body;
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // New post object includes category
    const newPost = { name, imageLink, description, pricePerKg, availableQuantity, category };
    user.startupPosts.push(newPost);
    await user.save();

    res.status(201).json({ message: 'Startup post created successfully', post: newPost });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create startup post', error: err.message });
  }
});


router.post('/post-query', verifyToken, async (req, res) => {
  const { queryPosts } = req.body;
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // New post object includes pricePerKg and availableQuantity
    const newPost = { queryPosts };
    user.queryPosts.push(newPost);
    await user.save();

    res.status(201).json({ message: 'Startup post created successfully', post: newPost });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create startup post', error: err.message });
  }
});





router.get("/get-all-queries", async (req, res) => {
  try {
    const users = await User.find({}, "queryPosts name"); // Fetch users with queries

    const allQueries = users
      .map((user) =>
        user.queryPosts.map((query) => ({
          queryId: query._id,
          name: user.name,
          queryText: query.queryPosts,
          createdAt: query.createdAt,
          replies: query.replies, // Include all replies for this query
        }))
      )
      .flat();

    res.status(200).json({ queries: allQueries });
  } catch (error) {
    console.error("Error fetching all queries:", error);
    res.status(500).json({ message: "Failed to fetch queries", error: error.message });
  }
});
router.post("/post-reply/:queryId", async (req, res) => {
  try {
    const { replyText } = req.body; // Get reply text
    const { queryId } = req.params;

    // Find the user who owns the query
    const user = await User.findOne({ "queryPosts._id": queryId });

    if (!user) {
      return res.status(404).json({ message: "Query not found" });
    }

    // Find the specific query and push the reply
    const queryPost = user.queryPosts.id(queryId);
    queryPost.replies.push({ replyText });

    await user.save();

    res.status(200).json({ message: "Reply added successfully", replies: queryPost.replies });
  } catch (error) {
    console.error("Error posting reply:", error);
    res.status(500).json({ message: "Failed to post reply", error: error.message });
  }
});


// Route to fetch user details (name, email) and their startup posts
router.get('/get-startups', async (req, res) => {
  try {
    const users = await User.find({ role: 'Seller' }).select('name email startupPosts mobile profilePhoto');

    const posts = users.map(user => ({
      username: user.name,
      email: user.email,
      posts: user.startupPosts,
      mobile: user.mobile,
      profilePhoto: user.profilePhoto, // Include profile photo
    }));

    res.json({ posts });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch posts', error: err.message });
  }
});






export default router;
