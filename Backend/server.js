
// require("./instrument.js"); // disabled: OpenTelemetry/Sentry bootstrap was loading a broken @opentelemetry/instrumentation package
require('dotenv').config();

const express = require('express');
const Sentry = require("@sentry/node");
const mongoose = require('mongoose');
const cors = require('cors');
const Razorpay = require('razorpay');
const nodemailer = require('nodemailer');
const NGO = require('./models/NGO');
const Volunteer = require('./models/Volunteer');
const Transaction = require('./models/Transaction');
const app = express();
app.use(express.json());
app.use(cors());

// CONNECT DB
mongoose.connect('mongodb://127.0.0.1:27017/ngo-portal')
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ DB Error:", err));


// --- 2. ROUTES ---

// GET APPROVED NGOs (For Home Page)
    // mounted routers (see routes/)
    const adminRoutes = require('./routes/admin');
    const ngosRoutes = require('./routes/ngos');
    const volunteersRoutes = require('./routes/volunteers');
    const paymentRoutes = require('./routes/payment');
    const transactionsRoutes = require('./routes/transactions');
    const emailRoutes = require('./routes/email');

    app.use('/api/admin', adminRoutes);
    app.use('/api/ngos', ngosRoutes);
    app.use('/api/volunteers', volunteersRoutes);
    app.use('/api/payment', paymentRoutes);
    app.use('/api/transactions', transactionsRoutes);
    app.use('/api/send-email', emailRoutes);

// PUBLIC REGISTER routes moved to controllers/authController.js
const authRoutes = require('./controllers/authController');
app.use('/api', authRoutes);

const { authenticateJWT, requireRole } = require('./middleware/auth');

// Admin, NGO, volunteers, payment, transactions and email routes
// are handled by the mounted routers in ./routes/* and ./controllers/authController.js
// 1. DROP THE SENTRY NET RIGHT HERE
//Sentry.setupExpressErrorHandler(app);

// 2. DROP YOUR CUSTOM ERROR CATCHER RIGHT HERE (If you don't have this, paste it)
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 System Online on Port ${PORT}`));

