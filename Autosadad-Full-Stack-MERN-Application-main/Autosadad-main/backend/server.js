const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// --- CRITICAL FIX FOR MILESTONE 3 ---
// Ensure CORS is configured so your React app (usually port 5173) can talk to this server
app.use(cors()); 

app.use(express.json());
app.use(morgan("dev")); // This will show you the "500" errors in your terminal as they happen!

// Route imports
const userRoutes = require("./routes/userRoutes");
const billRoutes = require("./routes/billRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
const autoPayRoutes = require("./routes/autoPayRoutes");
const paymentIntegrationRoutes = require("./routes/paymentIntegrationRoutes");

// Mount routes
app.use("/api/users", userRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/auto-pay-rules", autoPayRoutes);
app.use("/api/payment-integration", paymentIntegrationRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Auto Sadad API is running (Milestone 3 Integration)" });
});

// Error Handling Middleware (Add this to catch the 500 errors!)
app.use((err, req, res, next) => {
  console.error("SERVER ERROR STACK:", err.stack); // This prints the secret to your fix in the terminal!
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});