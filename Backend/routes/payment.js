const express = require('express');
const Razorpay = require('razorpay');
const router = express.Router();

// POST /api/payment/order
router.post('/order', async (req, res) => {
  try {
    const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    const options = { amount: req.body.amount * 100, currency: 'INR', receipt: 'order_' + Date.now() };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) { res.status(500).send('Error creating order'); }
});

module.exports = router;
