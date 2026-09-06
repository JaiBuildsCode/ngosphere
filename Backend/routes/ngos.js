const express = require('express');
const NGO = require('../models/NGO');
const router = express.Router();

// GET /api/ngos (approved only)
router.get('/', async (req, res) => {
  try {
    const ngos = await NGO.find({ status: 'Approved' });
    res.json(ngos);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/ngos/:id/donate
router.put('/:id/donate', async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || isNaN(amount) || amount <= 0) return res.status(400).json({ error: 'A valid positive donation amount is required.' });

    const ngo = await NGO.findById(req.params.id);
    if (!ngo) return res.status(404).json({ error: 'NGO not found' });

    ngo.raised = (ngo.raised || 0) + parseInt(amount);
    const updatedNgo = await NGO.findByIdAndUpdate(req.params.id, { raised: ngo.raised }, { new: true });
    res.json(updatedNgo);
  } catch (err) {
    console.error('Donation Route Failed:', err);
    res.status(500).json({ error: 'Internal server error while processing donation.' });
  }
});

module.exports = router;
