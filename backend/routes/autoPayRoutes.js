const express = require("express");
const router = express.Router();
const AutoPayRule = require("../models/AutoPayRule");

router.post("/", async (req, res) => {
  try {
    const rule = await AutoPayRule.create(req.body);
    res.status(201).json(rule);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.userId) filter.userId = req.query.userId;

    const rules = await AutoPayRule.find(filter)
      .populate("billId", "billType provider amount dueDate")
      .sort({ createdAt: -1 });

    res.json(rules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;