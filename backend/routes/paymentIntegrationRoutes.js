const express = require("express");
const router = express.Router();
const PaymentIntegration = require("../models/PaymentIntegration");

// -------------------------------------------------------
// CREATE  (POST /api/payment-integrations)
// -------------------------------------------------------
router.post("/", async (req, res) => {
  try {
    const payment = await PaymentIntegration.create(req.body);
    res.status(201).json(payment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------
// READ ALL  (GET /api/payment-integrations)
// Optional filters: ?userId=... &/or ?billId=... &/or ?status=...
// -------------------------------------------------------
router.get("/", async (req, res) => {
  try {
    const filter = {};

    if (req.query.userId) filter.userId = req.query.userId;
    if (req.query.billId) filter.billId = req.query.billId;
    if (req.query.status) filter.status = req.query.status;

    const payments = await PaymentIntegration.find(filter)
      .sort({ createdAt: -1 }); // latest first (if you have createdAt)
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------
// READ ONE  (GET /api/payment-integrations/:id)
// -------------------------------------------------------
router.get("/:id", async (req, res) => {
  try {
    const payment = await PaymentIntegration.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ error: "Payment integration not found" });
    }
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------
// UPDATE  (PUT /api/payment-integrations/:id)
// -------------------------------------------------------
router.put("/:id", async (req, res) => {
  try {
    const updated = await PaymentIntegration.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ error: "Payment integration not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------
// DELETE  (DELETE /api/payment-integrations/:id)
// -------------------------------------------------------
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await PaymentIntegration.findByIdAndDelete(
      req.params.id
    );

    if (!deleted) {
      return res
        .status(404)
        .json({ error: "Payment integration not found" });
    }

    res.json({ message: "Payment integration deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;