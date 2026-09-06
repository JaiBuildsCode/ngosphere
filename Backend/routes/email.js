const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// POST /api/send-email
router.post('/', async (req, res) => {
  const { to, subject, text } = req.body;
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    family: 4,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });

  const mailOptions = { from: 'NGOSphere Admin <no-reply@ngosphere.com>', to, subject, text };
  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully to:', to);
    res.json({ message: 'Email Sent Successfully' });
  } catch (error) {
    console.error('❌ Email Error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

module.exports = router;
