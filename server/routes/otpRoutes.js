const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer'); // For sending OTP via email
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Your user model
const router = express.Router();

// Store OTPs temporarily in-memory (use a proper storage solution for production)
const otpStore = {};

// Configure nodemailer transporter (for email OTP)
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Route to request OTP
router.post('/request-otp', async (req, res) => {
  const { email } = req.body;
  
  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Hash the OTP before storing
    const hashedOtp = await bcrypt.hash(otp, 10);

    // Store OTP temporarily
    otpStore[email] = { otp: hashedOtp, expiresAt: Date.now() + 5 * 60 * 1000 }; // OTP expires in 5 minutes

    // Send OTP via email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
    });

    res.status(200).json({ message: 'OTP sent successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP.', error });
  }
});

// Route to verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const storedOtp = otpStore[email];

    // Check if OTP exists and has not expired
    if (!storedOtp || storedOtp.expiresAt < Date.now()) {
      return res.status(400).json({ message: 'OTP expired or invalid.' });
    }

    // Verify the OTP
    const isValidOtp = await bcrypt.compare(otp, storedOtp.otp);
    if (!isValidOtp) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    // Create JWT token for authenticated user
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Clear OTP after successful verification
    delete otpStore[email];

    res.status(200).json({ message: 'OTP verified successfully.', token });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying OTP.', error });
  }
});

module.exports = router;
