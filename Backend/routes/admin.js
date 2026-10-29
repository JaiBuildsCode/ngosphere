const express = require('express');
const NGO = require('../models/NGO');
const router = express.Router();
const { authenticateJWT, requireRole } = require('../middleware/auth');

// GET /api/admin/all
router.get('/all', authenticateJWT, requireRole('admin'), async (req, res) => {
  try {
    const ngos = await NGO.find();
    res.json(ngos);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/demo-data', authenticateJWT, requireRole('demo'), (req, res) => {
  res.json({
    ngos: [
      { _id: 'demo-ngo-1', title: 'Riverbank Community Trust', city: 'Pune', status: 'Approved', raised: 74000 },
      { _id: 'demo-ngo-2', title: 'Green Steps Initiative', city: 'Mumbai', status: 'Pending', raised: 28500 }
    ],
    volunteers: [
      { _id: 'demo-volunteer-1', name: 'Aarav Demo', email: 'aarav@example.invalid', role: 'Volunteer', status: 'Approved' },
      { _id: 'demo-volunteer-2', name: 'Mira Sample', email: 'mira@example.invalid', role: 'Volunteer', status: 'Pending' }
    ]
  });
});

// PUT /api/admin/approve/:id
router.put('/approve/:id', authenticateJWT, requireRole('admin'), async (req, res) => {
  try {
    await NGO.findByIdAndUpdate(req.params.id, { status: 'Approved' });
    res.json({ message: 'Approved' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/admin/delete/:id
router.delete('/delete/:id', authenticateJWT, requireRole('admin'), async (req, res) => {
  try {
    await NGO.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
