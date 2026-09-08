const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const NGO = require('../models/NGO');
const Volunteer = require('../models/Volunteer');
const User = require('../models/User');

const router = express.Router();

// POST /api/register-ngo
router.post('/register-ngo', async (req, res) => {
  try {
    const payload = {
      title: req.body.title,
      category: req.body.category,
      founder: req.body.founder,
      established: req.body.founded || req.body.established,
      phone: req.body.phone || req.body.contact,
      email: req.body.email,
      city: req.body.city,
      address: req.body.address,
      reg_no: req.body.reg_no || 'PENDING',
      desc: req.body.desc,
      image: req.body.image || "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80",
      goal: req.body.goal || 100000,
      coords: req.body.coords || (req.body.lat && req.body.lng ? [parseFloat(req.body.lat), parseFloat(req.body.lng)] : undefined),
      status: 'Pending',
      raised: 0
    };

    const newNGO = new NGO(payload);
    await newNGO.save();
    res.status(201).json({ message: 'Application Submitted!', ngo: newNGO });
  } catch (err) {
    console.error('Register NGO Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/volunteers
router.post('/volunteers', async (req, res) => {
  try {
    const newVol = new Volunteer(req.body);
    await newVol.save();
    res.status(201).json(newVol);
  } catch (err) {
    console.error('Volunteer Register Error:', err);
    res.status(400).json({ message: err.message });
  }
});

// Token helpers
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_ISSUER = process.env.JWT_ISSUER || 'ngosphere';
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || 'ngosphere_clients';

function signAccessToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '15m', issuer: JWT_ISSUER, audience: JWT_AUDIENCE });
}

function signRefreshToken(user) {
  return jwt.sign({ id: user._id, role: user.role, type: 'refresh' }, JWT_SECRET, { expiresIn: '30d', issuer: JWT_ISSUER, audience: JWT_AUDIENCE });
}

// User signup - POST /api/auth/register
router.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'name, email and password required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hash });
    // create tokens
    const refreshToken = signRefreshToken(user);
    const refreshHash = await bcrypt.hash(refreshToken, 12);
    user.refreshTokenHash = refreshHash;
    await user.save();

    const accessToken = signAccessToken(user);
    res.status(201).json({ accessToken, refreshToken, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Auth Register Error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User login - POST /api/auth/login
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    // rotate refresh token (store hash)
    const refreshToken = signRefreshToken(user);
    const refreshHash = await bcrypt.hash(refreshToken, 12);
    user.refreshTokenHash = refreshHash;
    await user.save();

    const accessToken = signAccessToken(user);
    res.json({ accessToken, refreshToken, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Auth Login Error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Refresh endpoint - POST /api/auth/refresh
router.post('/auth/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'Missing refreshToken' });

    let payload;
    try {
      payload = jwt.verify(refreshToken, JWT_SECRET, { issuer: JWT_ISSUER, audience: JWT_AUDIENCE });
    } catch (err) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // find user and verify stored refresh token matches
    const user = await User.findById(payload.id);
    if (!user || !user.refreshTokenHash) return res.status(401).json({ error: 'Refresh token revoked' });
    const ok = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!ok) return res.status(401).json({ error: 'Refresh token revoked' });

    // rotate
    const newRefresh = signRefreshToken(user);
    const newHash = await bcrypt.hash(newRefresh, 12);
    user.refreshTokenHash = newHash;
    await user.save();

    const accessToken = signAccessToken(user);
    res.json({ accessToken, refreshToken: newRefresh });
  } catch (err) {
    console.error('Refresh Error:', err);
    res.status(500).json({ error: 'Could not refresh token' });
  }
});

// Logout - POST /api/auth/logout
router.post('/auth/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ ok: true });

    let payload;
    try { payload = jwt.verify(refreshToken, JWT_SECRET, { issuer: JWT_ISSUER, audience: JWT_AUDIENCE }); } catch (e) { return res.status(200).json({ ok: true }); }

    const user = await User.findById(payload.id);
    if (user && user.refreshTokenHash) {
      const ok = await bcrypt.compare(refreshToken, user.refreshTokenHash);
      if (ok) {
        user.refreshTokenHash = null;
        await user.save();
      }
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Logout Error:', err);
    res.status(500).json({ error: 'Logout failed' });
  }
});

module.exports = router;
