const express = require("express");
const router = express.Router();
const Bill = require("../models/Bill");
const { protect } = require("../Middleware/authMiddleware");

// All routes here need a login token
router.use(protect);

// GET ALL BILLS
router.get("/", async (req, res) => {
  try {
    const bills = await Bill.find({ userId: req.user._id }); 
    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: "Backend error" });
  }
});

// CREATE A BILL
router.post("/", async (req, res) => {
  try {
    const newBill = new Bill({
      ...req.body,
      userId: req.user._id 
    });
    const savedBill = await newBill.save();
    res.status(201).json(savedBill);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- NEW: UPDATE BILL STATUS (Mark as Done/Paid) ---
router.put("/:id", async (req, res) => {
  try {
    const bill = await Bill.findOne({ _id: req.params.id, userId: req.user._id });

    if (!bill) {
      return res.status(404).json({ message: "Bill not found or unauthorized" });
    }

    // Update the status from the request body
    bill.status = req.body.status || bill.status;
    const updatedBill = await bill.save();
    
    res.json(updatedBill);
  } catch (err) {
    res.status(500).json({ message: "Update failed: " + err.message });
  }
});

// --- NEW: DELETE A BILL ---
router.delete("/:id", async (req, res) => {
  try {
    const result = await Bill.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!result) {
      return res.status(404).json({ message: "Bill not found or unauthorized" });
    }

    res.json({ message: "Bill deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;