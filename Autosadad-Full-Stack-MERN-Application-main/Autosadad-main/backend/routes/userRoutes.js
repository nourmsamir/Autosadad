const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../Middleware/authMiddleware");

// Helper function to generate JWT
const generateToken = (id) => {
  // Ensure JWT_SECRET is defined in your backend .env file
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: "30d",
  });
};

// @route   POST /api/users
// @desc    Register new user
// @access  Public
router.post("/", async (req, res) => {
  const { username, email, password, phone } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    // This triggers the pre-save hook in your User.js model
    console.log("Registering user: Attempting to save..."); 
    const user = await User.create({
      username,
      email,
      password, // Plain text here, becomes hash in the database
      phone,
    });

    if (user) {
      console.log("User saved successfully. Hashing should be complete.");
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (err) {
    console.error("Registration Error:", err.message);
    res.status(400).json({ error: err.message });
  }
});

// @route   POST /api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    // This uses the .matchPassword() method you added to your User model
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   GET /api/users/profile
// @desc    Get user data
// @access  Private
router.get("/profile", protect, async (req, res) => {
  // req.user is populated by the protect middleware
  res.json(req.user);
});

module.exports = router;