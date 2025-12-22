const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  phone:     { type: String },
  createdAt: { type: Date, default: Date.now },
});

/**
 * MILESTONE 3 REQUIREMENT: PASSWORD HASHING
 * This middleware runs before every .save() or .create() call.
 * It ensures passwords are never stored in plaintext in MongoDB Atlas.
 */
userSchema.pre("save", async function () {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) {
    return; // Modern async middleware doesn't strictly need next()
  }

  try {
    // Generate a salt with 10 rounds
    const salt = await bcrypt.genSalt(10);
    // Hash the password using the salt
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    // Throwing error here will prevent the user from being saved with a bad password
    throw new Error("Password hashing failed: " + error.message);
  }
});

/**
 * HELPER METHOD: COMPARE PASSWORD
 * Used in userRoutes.js during login to compare entered password with hash.
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);