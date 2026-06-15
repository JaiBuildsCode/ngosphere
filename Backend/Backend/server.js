
//require("./instrument.js");
require('dotenv').config();

const express = require('express');
//const Sentry = require("@sentry/node");
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// CONNECT DB
mongoose.connect('mongodb://127.0.0.1:27017/ngo-portal')
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ DB Error:", err));

// --- 1. SCHEMA ---
const NGOSchema = new mongoose.Schema({
    title: String,
    city: String,
    category: String,
    desc: String,
    image: String,
    founder: String,
    established: String,
    phone: String,
    email: String,
    website: String,
    // FUNDRAISING FIELDS
    raised: { type: Number, default: 0 },
    goal: { type: Number, default: 100000 }, 
    status: { type: String, default: 'Pending' }
});
const NGO = mongoose.model('NGO', NGOSchema);

// --- 2. ROUTES ---

// GET APPROVED NGOs (For Home Page)
app.get('/api/ngos', async (req, res) => {
    try {
        const ngos = await NGO.find({ status: 'Approved' });
        res.json(ngos);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUBLIC REGISTER
app.post('/api/register-ngo', async (req, res) => {
    try {
        const newNGO = new NGO({
            ...req.body,
            status: 'Pending',
            image: req.body.image || "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80"
        });
        await newNGO.save();
        res.json({ message: "Application Submitted!" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- ADMIN ROUTES ---

// GET ALL
app.get('/api/admin/all', async (req, res) => {
    const ngos = await NGO.find();
    res.json(ngos);
});

// APPROVE
app.put('/api/admin/approve/:id', async (req, res) => {
    await NGO.findByIdAndUpdate(req.params.id, { status: 'Approved' });
    res.json({ message: "Approved" });
});

// REJECT / DELETE
app.delete('/api/admin/delete/:id', async (req, res) => {
    await NGO.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

// START SERVER
app.listen(5000, () => console.log("🚀 Server Port: 5000"));

app.put('/api/ngos/:id/donate', async (req, res) => {
    try { 
        const { amount } = req.body; 
        const ngo = await NGO.findById(req.params.id); 
        if (!ngo) return res.status(404).send("NGO not found"); 
        ngo.raised = (ngo.raised || 0) + parseInt(amount); 
        await ngo.save(); 
        res.json(ngo); 
    } catch (err) { res.status(500).send(err.message); }
});

app.get('/api/volunteers', async (req, res) => {
    try { const volunteers = await Volunteer.find().sort({ submittedAt: -1 }); res.json(volunteers); } 
    catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/volunteers', async (req, res) => {
    try { const newVol = new Volunteer(req.body); await newVol.save(); res.status(201).json(newVol); } 
    catch (err) { res.status(400).json({ message: err.message }); }
});

app.delete('/api/volunteers/:id', async (req, res) => {
    try { await Volunteer.findByIdAndDelete(req.params.id); res.json({ message: "Volunteer Removed" }); } 
    catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/volunteers/approve/:id', async (req, res) => {
    try { const vol = await Volunteer.findByIdAndUpdate(req.params.id, { status: "Approved" }, { new: true }); res.json(vol); } 
    catch (err) { res.status(500).json({ error: err.message }); }
});

// Payment Route - Create Order
app.post('/api/payment/order', async (req, res) => {
    try {
        const razorpay = new Razorpay({ 
            key_id: process.env.RAZORPAY_KEY_ID, 
            key_secret: process.env.RAZORPAY_KEY_SECRET 
        });
        const options = { amount: req.body.amount * 100, currency: "INR", receipt: "order_" + Date.now() };
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (err) { res.status(500).send("Error creating order"); }
});

// 🔥 THE NEW ROUTE: Calculate Global Platform Stats
app.get('/api/stats/global', async (req, res) => {
    try {
        const result = await Transaction.aggregate([
            { $match: { ngoId: "GLOBAL_PLATFORM_DONATION", status: "success" } },
            { $group: { _id: null, totalRaised: { $sum: "$amount" } } }
        ]);
        const total = result.length > 0 ? result[0].totalRaised : 0;
        res.status(200).json({ totalRaised: total });
    } catch (err) {
        console.error("Aggregation Error:", err);
        res.status(500).json({ error: "Failed to calculate platform stats." });
    }
});

// The Universal Database Route
app.post('/api/transactions', async (req, res) => {
    try {
        const { ngoId, amount, razorpay_payment_id } = req.body;

        if (!razorpay_payment_id) {
            return res.status(400).json({ error: "Missing Razorpay ID" });
        }

        const newTx = new Transaction({
            ngoId: ngoId || "GLOBAL_PLATFORM_DONATION", 
            amount: amount, 
            razorpay_payment_id: razorpay_payment_id,
            status: "success",
            createdAt: new Date()
        });
        await newTx.save();

        if (ngoId && ngoId !== "GLOBAL_PLATFORM_DONATION") {
            await NGO.findByIdAndUpdate(ngoId, { $inc: { raised: amount } });
            console.log(`✅ [NGO TXN] ₹${amount} saved for NGO ID: ${ngoId}`);
        } else {
            console.log(`✅ [GLOBAL TXN] ₹${amount} saved securely in the Transaction ledger.`);
        }

        res.status(200).json({ success: true, transaction: newTx });
    } catch (err) {
        console.error("Database Write Error:", err);
        res.status(500).json({ error: "Payment failed to save.", details: err.message });
    }
}); // <-- THIS PROPERLY CLOSES THE TRANSACTION ROUTE NOW

// Email Route
app.post('/api/send-email', async (req, res) => {
    const { to, subject, text } = req.body;
    
    // EXPLICIT CONNECTION - KILLS THE IPv6 RENDER BUG
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        family: 4, // Force IPv4 routing
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: 'NGOSphere Admin <no-reply@ngosphere.com>', // Note: Gmail often overrides this with your actual email address
        to: to,
        subject: subject,
        text: text
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully to:", to);
        res.json({ message: "Email Sent Successfully" });
    } catch (error) {
        console.error("❌ Email Error:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
});
// 1. DROP THE SENTRY NET RIGHT HERE
//Sentry.setupExpressErrorHandler(app);


// 2. DROP YOUR CUSTOM ERROR CATCHER RIGHT HERE (If you don't have this, paste it)
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 System Online on Port ${PORT}`));

