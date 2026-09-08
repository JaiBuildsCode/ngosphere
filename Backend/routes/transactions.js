const express = require('express');
const Transaction = require('../models/Transaction');
const NGO = require('../models/NGO');
const router = express.Router();

// POST /api/transactions
router.post('/', async (req, res) => {
  try {
    const { ngoId, amount, razorpay_payment_id } = req.body;
    if (!razorpay_payment_id) return res.status(400).json({ error: 'Missing Razorpay ID' });

    const newTx = new Transaction({ ngoId: ngoId || 'GLOBAL_PLATFORM_DONATION', amount: amount, razorpay_payment_id, status: 'success', createdAt: new Date() });
    await newTx.save();

    if (ngoId && ngoId !== 'GLOBAL_PLATFORM_DONATION') {
      await NGO.findByIdAndUpdate(ngoId, { $inc: { raised: amount } });
      console.log(`✅ [NGO TXN] ₹${amount} saved for NGO ID: ${ngoId}`);
    } else {
      console.log(`✅ [GLOBAL TXN] ₹${amount} saved securely in the Transaction ledger.`);
    }

    res.status(200).json({ success: true, transaction: newTx });
  } catch (err) {
    console.error('Database Write Error:', err);
    res.status(500).json({ error: 'Payment failed to save.', details: err.message });
  }
});

// GET /api/stats/global
router.get('/stats/global', async (req, res) => {
  try {
    const result = await Transaction.aggregate([
      { $match: { ngoId: 'GLOBAL_PLATFORM_DONATION', status: 'success' } },
      { $group: { _id: null, totalRaised: { $sum: '$amount' } } }
    ]);
    const total = result.length > 0 ? result[0].totalRaised : 0;
    res.status(200).json({ totalRaised: total });
  } catch (err) {
    console.error('Aggregation Error:', err);
    res.status(500).json({ error: 'Failed to calculate platform stats.' });
  }
});

module.exports = router;
