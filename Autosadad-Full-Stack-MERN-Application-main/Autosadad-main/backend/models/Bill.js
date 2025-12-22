const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  billType: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    required: true, 
  },
  amount: {
    type: Number,
    required: true, // Recommended to make this required
  },
  dueDate: {
    type: Date,
    required: true, // Recommended for the "Reminders" feature
  },
  referenceNo: {
    type: String,
  },
  // ADD THIS FIELD:
  status: {
    type: String,
    default: "Pending", // This ensures "Pending" appears automatically
    enum: ["Pending", "Paid"]
  }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

module.exports = mongoose.model("Bill", billSchema);