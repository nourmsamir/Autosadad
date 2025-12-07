const express = require("express");
const router = express.Router();
const Bill = require("../models/Bill");

// CREATE bill
router.post("/", async (req, res) => {
  try {
    const bill = await Bill.create(req.body);
    res.status(201).json(bill);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ all bills
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.userId) filter.userId = req.query.userId;

    const bills = await Bill.find(filter)
      .populate("userId", "username email")
      .sort({ dueDate: 1 });

    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ one bill
router.get("/:id", async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id).populate("userId", "username email");
    if (!bill) return res.status(404).json({ error: "Bill not found" });

    res.json(bill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE bill
router.put("/:id", async (req, res) => {
  try {
    const updated = await Bill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: "Bill not found" });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE bill
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Bill.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Bill not found" });

    res.json({ message: "Bill deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
