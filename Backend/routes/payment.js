const express = require('express');
const Stripe = require('stripe');
const Transaction = require('../models/Transaction');

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    const donorName = typeof req.body.donorName === 'string' && req.body.donorName.trim()
      ? req.body.donorName.trim()
      : 'Anonymous';

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ error: 'A valid positive donation amount is required.' });
    }

    const donation = await Transaction.create({
      ngoId: req.body.ngoId || 'GLOBAL_PLATFORM_DONATION',
      donorName,
      amount,
      status: 'Pending'
    });

    const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'inr',
          unit_amount: Math.round(amount * 100),
          product_data: { name: 'Donation to NGOSphere' }
        },
        quantity: 1
      }],
      metadata: {
        donationId: donation._id.toString(),
        donorName,
        ngoId: donation.ngoId ? donation.ngoId.toString() : 'GLOBAL_PLATFORM_DONATION'
      },
      success_url: `${clientUrl}/?donation=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/?donation=cancelled`,
    });

    await Transaction.updateOne({ _id: donation._id }, { $set: { stripeSessionId: session.id } });
    return res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe Checkout creation failed:', err);
    return res.status(500).json({ error: 'Could not create Stripe checkout session.' });
  }
});

async function stripeWebhookHandler(req, res) {
  const signature = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const donationId = session.metadata && session.metadata.donationId;

    if (!donationId) {
      return res.status(400).json({ error: 'Missing donationId in checkout session metadata.' });
    }

try {
    const donation = await Transaction.findOneAndUpdate(
      { _id: donationId, status: 'Pending' },
      {
        $set: {
          status: 'Completed',
          stripePaymentIntentId: session.payment_intent || undefined
        }
      },
      { returnDocument: 'after' } // <--- This goes to MongoDB, not Stripe
    );

    if (donation && donation.ngoId && donation.ngoId !== 'GLOBAL_PLATFORM_DONATION') {
      const NGO = require('../models/NGO');
      await NGO.findByIdAndUpdate(donation.ngoId, { $inc: { raised: donation.amount } });
    }

    // This proves to you in the terminal that it worked
    console.log(`✅ Webhook verified! Donation ${donationId} successfully marked as Completed.`);

  } catch (err) {
    console.error('Could not complete Stripe donation:', err);
    return res.status(500).json({ error: 'Could not update donation record.' });
  }

  // Stripe just wants a simple 200 OK to know you received it
  return res.status(200).json({ received: true });
  }
}

module.exports = router;
module.exports.stripeWebhookHandler = stripeWebhookHandler;
