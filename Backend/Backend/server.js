const bcrypt = require ('bcryptjs');
const User = require ('./models/User');
// require("./instrument.js"); // disabled: OpenTelemetry/Sentry bootstrap was loading a broken @opentelemetry/instrumentation package
require('dotenv').config();
const jwt = require('jsonwebtoken');
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
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ngo-portal')
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection error:', err));  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ DB Error:", err));


  const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(' ')[1]; // Strips the "Bearer " part

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the decoded payload to the request
        next(); // Pass the baton, let them in
    } catch (err) {
        return res.status(403).json({ error: "Forbidden: Invalid or expired token" });
    }
};


const requireAut = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(' ')[1]; // Strips the "Bearer " part

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the decoded payload to the request
        next(); // Pass the baton, let them in
    } catch (err) {
        return res.status(403).json({ error: "Forbidden: Invalid or expired token" });
    }
};
const verifyAdmin = (req, res, next) => {
    // 1. Look at the incoming request and grab the Authorization header
    const token = req.header('Authorization');
    
    // 2. If they didn't bring a keycard at all, kick them out immediately
    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        // 3. Tokens usually come in as "Bearer <token>". We strip the word "Bearer ".
        const actualToken = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;
        
        // 4. Cryptographically verify the token hasn't been tampered with
        const verified = jwt.verify(actualToken, process.env.JWT_SECRET);
        
        // 5. THE DEADBOLT: Are they actually an admin?
        if (verified.role !== 'admin') {
            return res.status(403).json({ error: "Forbidden. Admin access required." });
        }

        // 6. They passed. Attach their ID to the request and open the door (next)
        req.user = verified;
        next(); 

    } catch (err) {
        return res.status(400).json({ error: "Invalid or expired token." });
    }
};
app.get('/api/admin/dashboard', verifyAdmin, (req, res) => {
    // If the code reaches this point, the user is 100% a verified admin.
    return res.status(200).json({ 
        message: "Welcome to the Admin Vault. You are fully authorized.",
        secureData: "This is the data that buys your freedom." 
    });
});
// --- 2. ROUTES ---

// GET APPROVED NGOs (For Home Page)
    app.get('/api/ngos', async (req, res) => {
        try {
            const ngos = await NGO.find({ status: 'Approved' });
            res.json(ngos);
        } catch (err) { res.status(500).json({ error: err.message }); }
    });

    
    // JWT Route

 app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. The Lookup: Does this email even exist?
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials." });
        }

        // 2. The Scanner: Compare the raw password to the database hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials." });
        }

        // 3. The Keycard: Mint the JWT with their actual database ID and Role
        const token = jwt.sign(
            { userId: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );
        
        return res.json({ message: "Login successful", token: token });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error during login." });
    }
});
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name,   email, password, adminSecret } = req.body;

        let assignedRole = 'user';
        // If the secret matches our hardcoded master key, upgrade the role
        if (adminSecret === 'NGO_MASTER_2026') {
            assignedRole = 'admin';
        }
        // 1. The Guard: Check if the email is already taken
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already in use." });
        }

        // 2. The Shredder: Hash the password (NEVER save plain text)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. The Vault: Save to database
        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword,
            role: assignedRole
        });

        await newUser.save();

        return res.status(201).json({ message: "User registered successfully." });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error during registration." });
    }
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
// 1. Rename the route to match the frontend, and drop the verifyAdmin bouncer in the middle
app.get('/api/api/admin/ngos', verifyAdmin, async (req, res) => {
    try {
        // 2. Safely fetch every single NGO from MongoDB
        const ngos = await NGO.find();
        
        // 3. Return the raw array to the frontend engine
        res.status(200).json(ngos);
    } catch (err) {
        // 4. Prevent backend crashes with proper error logging
        console.error("Admin data fetch crash:", err);
        res.status(500).json({ error: "Internal server error fetching admin records." });
    }
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

app.get('/api/protected-data', requireAuth, (req, res) => {
    res.json({ message: "Welcome to the vault.", user: req.user });
});
app.put('/api/ngos/:id/donate', async (req, res) => {
    try { 
        const { amount } = req.body; 
        
        // LAYER 1: The Gatekeeper (Input Validation)
        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ error: "A valid positive donation amount is required." });
        }

        // LAYER 2: Find the document
        const ngo = await NGO.findById(req.params.id); 
        if (!ngo) return res.status(404).json({ error: "NGO not found" }); 
        
        // LAYER 3: Secure Update 
        // We use findByIdAndUpdate to bypass validation errors on old, incomplete NGO documents
        ngo.raised = (ngo.raised || 0) + parseInt(amount); 
        const updatedNgo = await NGO.findByIdAndUpdate(
            req.params.id, 
            { raised: ngo.raised }, 
            { new: true }
        );
        
        res.json(updatedNgo); 

    } catch (err) { 
        // THE ALARM: Logs the real error message to your local terminal
        console.error("CRITICAL ALARM - Donation Route Failed:", err);
        
        // THE SHIELD: Hides raw database errors from hackers
        res.status(500).json({ error: "Internal server error while processing donation." }); 
    }
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

