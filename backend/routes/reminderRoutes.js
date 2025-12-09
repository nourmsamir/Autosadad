const express = require("express");
const router = express.Router();
const Reminder = require("../models/Reminder");

// CREATE  (POST /api/reminders)
router.post("/", async (req, res) => {
  try {
    const reminder = await Reminder.create(req.body);
    res.status(201).json(reminder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ ALL  (GET /api/reminders)
router.get("/", async (req, res) => {
  try {
    const filter = {};

    if (req.query.userId) {
      filter.userId = req.query.userId;
    }
    if (req.query.billId) {
      filter.billId = req.query.billId;
    }

    const reminders = await Reminder.find(filter)
      .sort({ reminderDate: 1 });
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ONE  (GET /api/reminders/:id)
router.get("/:id", async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);
    if (!reminder) {
      return res.status(404).json({ error: "Reminder not found" });
    }
    res.json(reminder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE  (PUT /api/reminders/:id)
router.put("/:id", async (req, res) => {
  try {
    const updated = await Reminder.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,          
        runValidators: true 
      }
    );

    if (!updated) {
      return res.status(404).json({ error: "Reminder not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE  (DELETE /api/reminders/:id)
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Reminder.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Reminder not found" });
    }

    res.json({ message: "Reminder deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
