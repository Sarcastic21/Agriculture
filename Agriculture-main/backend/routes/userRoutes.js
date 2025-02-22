import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import multer from "multer";
import User from "../models/UserModel.js";
import verifyToken  from "../middleware/auth.js"; // Ensure the correct file extension

const saltRounds = 10;
const router = express.Router();

// Add your routes here...









const SECRET_KEY = process.env.JWT_SECRET_KEY || '3hk1qwfu80cyqw3r1jfqpe9vdayqehpifb31rjlpihfwipbfjel31fpih8FHWUBJUWO8U3R1J';
const EMAIL_USER = process.env.EMAIL_USER || 'itsayushmaurya991@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'enld uruf jduj dels';
let otpStore = {}; 



// Configure Multer to store files in memory as Buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload-profile-photo", verifyToken, upload.single("profilePhoto"), async (req, res) => {
  try {
    const userId = req.user.userId; // Use req.user.userId (as per middleware)
    console.log("User ID:", userId);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Convert image to Base64
    user.profilePhoto = req.file.buffer.toString("base64");
    await user.save();

    res.status(200).json({ message: "Profile photo updated successfully", profilePhoto: user.profilePhoto });
  } catch (error) {
    res.status(500).json({ message: "Error uploading profile photo", error: error.message });
  }
});






const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// Send OTP
router.post('/send-otp2', async (req, res) => {
  const { email } = req.body;
  const otp = generateOtp();

  // Set OTP expiry time (5 minutes)
  otpStore[email] = { otp, expires: Date.now() + 300000 };

  // Create a transporter using your email service (here using Gmail as an example)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'itsayushmaurya991@gmail.com',
      pass: 'enld uruf jduj dels',
    },
  });

  // Mail options
  const mailOptions = {
    from: 'itsayushmaurya991@gmail.com',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] && otpStore[email].otp === otp && Date.now() < otpStore[email].expires) {
    delete otpStore[email]; // Remove OTP after successful verification
    res.status(200).json({ message: 'OTP verified' });
  } else {
    res.status(400).json({ message: 'Invalid or expired OTP' });
  }
});

// Register User
router.post('/register', async (req, res) => {
  const { name, email, mobile, password, role } = req.body;
  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user with the hashed password
    const newUser = new User({ name, email, mobile, password: hashedPassword, role });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (err) {
    console.error("Error during user registration:", err);
    res.status(500).json({ message: 'Error registering user' });
  }
});

router.delete("/delete", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId; // Extracting user ID from JWT
    console.log("Deleting User ID:", userId);

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Account deleted successfully." });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ success: false, message: "Error deleting account." });
  }
});


// Login user
router.post('/login', async (req, res) => {
  const { mobile, password } = req.body;
  try {
    const user = await User.findOne({ mobile });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Create JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, SECRET_KEY, { expiresIn: '48h' });

    res.json({ message: 'Login successful', token, user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Send OTP for password reset (same as before)
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  try {
    // Check if the user exists in the database
    let user = await User.findOne({ email });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    if (user) {
      // If user exists, it's for password reset
      user.otp = hashedOtp;
      user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
      await user.save();

      // Send OTP for password reset
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: EMAIL_USER, pass: EMAIL_PASS },
      });

      const mailOptions = {
        from: EMAIL_USER,
        to: email,
        subject: 'Password Reset OTP',
        text: `Your OTP for password reset is: ${otp}`,
      };

      await transporter.sendMail(mailOptions);
      return res.json({ success: true, message: 'OTP sent to your email for password reset.' });
    } else {
      // If the user doesn't exist, it's for registration
      user = new User({ email, otp: hashedOtp, otpExpires: Date.now() + 10 * 60 * 1000 });
      await user.save();

      // Send OTP for registration
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: EMAIL_USER, pass: EMAIL_PASS },
      });

      const mailOptions = {
        from: EMAIL_USER,
        to: email,
        subject: 'Registration OTP',
        text: `Your OTP for registration is: ${otp}`,
      };

      await transporter.sendMail(mailOptions);
      return res.json({ success: true, message: 'OTP sent to your email for registration.' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to send OTP.', error: err.message });
  }
});

// Reset Password
router.post('/forgot-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isOtpValid = await bcrypt.compare(otp, user.otp);
    if (!isOtpValid || Date.now() > user.otpExpires)
      return res.status(400).json({ message: 'Invalid or expired OTP.' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to reset password.' });
  }
});

// Profile Route
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password -otp -otpExpires');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ status: 'success', user });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});






export default router;
