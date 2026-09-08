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
