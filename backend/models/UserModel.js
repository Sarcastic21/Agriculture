import mongoose from "mongoose";

// Subschema for startup posts
const startupPostSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageLink: { type: String, required: true },
  description: { type: String, required: true },
  pricePerKg: { type: Number, required: true }, // Add price per kg
  availableQuantity: { type: Number, required: true }, // Add available quantity
  category: [{ type: String, enum: ["Fruits", "Vegetables", "Grains"], required: true }],
  createdAt: { type: Date, default: Date.now },
});

const replySchema = new mongoose.Schema({
  replyText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const queryPostSchema = new mongoose.Schema({
  queryPosts: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }, // Add createdAt field
  replies: [replySchema], // Array to store replies
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Buyer", "Seller"], required: true },
  otp: { type: String, default: null }, // Field to store the OTP
  otpExpires: { type: Date, default: null }, // Field to store the OTP expiration time
  startupPosts: [startupPostSchema], // Array of startup posts
  queryPosts: [queryPostSchema], // Array of query posts
  profilePhoto: { type: String, default: "" },
});

// Export model using ES module syntax
const User = mongoose.model("User", userSchema);
export default User;
