const express = require("express");
const router = express.Router();
const PaymentIntegration = require("../models/PaymentIntegration");

router.post("/", async (req, res) => {
  try {
    const payment = await PaymentIntegration.create(req.body);
    res.status(201).json(payment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.userId) filter.userId = req.query.userId;

    const payments = await PaymentIntegration.find(filter)
      .populate("billId", "billType provider amount dueDate")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
