const express = require("express");
const router = express.Router();
const AutoPayRule = require("../models/AutoPayRule");

// CREATE  (POST /api/auto-pay-rules)
router.post("/", async (req, res) => {
  try {
    const rule = await AutoPayRule.create(req.body);
    res.status(201).json(rule);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ ALL  (GET /api/auto-pay-rules)
router.get("/", async (req, res) => {
  try {
    const filter = {};

    if (req.query.userId) filter.userId = req.query.userId;
    if (req.query.billId) filter.billId = req.query.billId;
    if (req.query.isActive !== undefined) {
      // expect "true" or "false" as string
      filter.isActive = req.query.isActive === "true";
    }

    const rules = await AutoPayRule.find(filter)
      .sort({ nextPayment: 1 }); // soonest payment first (if field exists)
    res.json(rules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ONE  (GET /api/auto-pay-rules/:id)
router.get("/:id", async (req, res) => {
  try {
    const rule = await AutoPayRule.findById(req.params.id);
    if (!rule) {
      return res.status(404).json({ error: "Auto-pay rule not found" });
    }
    res.json(rule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE  (PUT /api/auto-pay-rules/:id)
router.put("/:id", async (req, res) => {
  try {
    const updated = await AutoPayRule.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated) {
      return res.status(404).json({ error: "Auto-pay rule not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE  (DELETE /api/auto-pay-rules/:id)
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await AutoPayRule.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Auto-pay rule not found" });
    }

    res.json({ message: "Auto-pay rule deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;