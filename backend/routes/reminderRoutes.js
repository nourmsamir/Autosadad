const express = require("express");
const router = express.Router();
const Reminder = require("../models/Reminder"); // make sure this file exists

// TEST ROUTE (no DB) – GET /api/reminders/ping
router.get("/ping", (req, res) => {
  console.log("HIT /api/reminders/ping");
  res.json({ message: "reminders ping ok" });
});

// CREATE – POST /api/reminders
router.post("/", async (req, res) => {
  try {
    const reminder = await Reminder.create(req.body);
    res.status(201).json(reminder);
  } catch (err) {
    console.error("Error creating reminder:", err);
    res.status(400).json({ error: err.message });
  }
});

// READ ALL – GET /api/reminders
router.get("/", async (req, res) => {
  try {
    const reminders = await Reminder.find().populate("billId");
    res.json(reminders);
  } catch (err) {
    console.error("Error getting reminders:", err);
    res.status(500).json({ error: err.message });
  }
});

// READ ONE – GET /api/reminders/id/:id
router.get("/id/:id", async (req, res) => {
  console.log("HIT GET /api/reminders/id/", req.params.id);
  try {
    const reminder = await Reminder.findById(req.params.id).populate("billId");

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    res.json(reminder);
  } catch (err) {
    console.error("Error getting reminder by id:", err);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE – PUT /api/reminders/id/:id
router.put("/id/:id", async (req, res) => {
  console.log("HIT PUT /api/reminders/id/", req.params.id);
  try {
    const reminder = await Reminder.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    res.json(reminder);
  } catch (err) {
    console.error("Error updating reminder:", err);
    res.status(400).json({ error: err.message });
  }
});

// DELETE – DELETE /api/reminders/id/:id
router.delete("/id/:id", async (req, res) => {
  console.log("HIT DELETE /api/reminders/id/", req.params.id);
  try {
    const reminder = await Reminder.findByIdAndDelete(req.params.id);

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    res.json({ message: "Reminder deleted" });
  } catch (err) {
    console.error("Error deleting reminder:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;