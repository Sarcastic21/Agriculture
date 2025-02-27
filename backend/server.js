import express from "express";
import cors from "cors";
import connectDB from "./db.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";

connectDB();

const app = express();
app.use(express.json({ limit: "10mb" })); // Increase JSON payload size
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // Increase URL-encoded payload size

// Configure CORS
const corsOptions = {
  origin: ["http://localhost:3000", "https://bucolic-baklava-a91df7.netlify.app"], // Allow specific origins
  methods: "GET,POST,PUT,DELETE", // Allow specific HTTP methods
  credentials: true, // Allow cookies (if needed)
};
app.use(cors(corsOptions));

app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve static files from uploads folder

// Routes
app.use("/api/users", userRoutes);
app.use("/api/users", postRoutes);

console.log("API routes are registered");

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
