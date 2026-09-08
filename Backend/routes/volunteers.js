const express = require('express');
const Volunteer = require('../models/Volunteer');
const router = express.Router();
const { authenticateJWT, requireRole } = require('../middleware/auth');

// GET /api/volunteers
router.get('/', async (req, res) => {
  try {
    const volunteers = await Volunteer.find().sort({ submittedAt: -1 });
    res.json(volunteers);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/volunteers/:id
router.delete('/:id', authenticateJWT, requireRole('admin'), async (req, res) => {
  try {
    await Volunteer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Volunteer Removed' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PATCH /api/volunteers/approve/:id
router.patch('/approve/:id', authenticateJWT, requireRole('admin'), async (req, res) => {
  try {
    const vol = await Volunteer.findByIdAndUpdate(req.params.id, { status: 'Approved' }, { new: true });
    res.json(vol);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
