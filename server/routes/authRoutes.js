const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { username, email, password, firstName, lastName, phoneNumber } = req.body; // Modified to include new fields
  try {
    // Check if phone number already exists
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ error: 'Phone number is already registered.' });
    }

    const user = new User({ username, email, password, firstName, lastName, phoneNumber });
    await user.save();
    res.status(201).send('User registered');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password, phoneNumber } = req.body;

  try {
    // Check if it's an OTP-based login (phoneNumber is present) or email-password based login
    if (phoneNumber) {
      // OTP-Based Login
      const user = await User.findOne({ phoneNumber });
      if (!user) {
        return res.status(404).send('Phone number not registered.');
      }

      const payload = {
        id: user._id,
        name: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: '1h',
      });

      return res.json({ token, user: payload });
    } else if (email && password) {
      // Password-Based Login
      const user = await User.findOne({ email });
      if (!user) return res.status(404).send('User not found');

      // Compare password with stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).send('Invalid password');

      const payload = {
        id: user._id,
        name: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: '1h',
      });

      return res.json({ token, user: payload });
    } else {
      // If neither email-password nor phoneNumber is provided, return an error
      return res.status(400).send('Invalid login credentials');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Validate Phone Number (for OTP login)
router.post('/validate-phone', async (req, res) => {
  const { phoneNumber } = req.body;
  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ error: 'Phone number not registered.' });
    }

    // Send only required user data, excluding sensitive information like password
    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
    };

    res.status(200).json({ user: userData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Validate Password for Reset
router.post('/validate-password', async (req, res) => {
  const { email, currPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Check if the current password matches the stored password
    const isMatch = await bcrypt.compare(currPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ valid: false, error: 'Current password is incorrect.' });
    }

    res.status(200).json({ valid: true, message: 'Password is correct.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Password Route
router.post('/update-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    
    user.password = newPassword;
    await user.save();

    res.status(200).send('Password updated successfully.');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
