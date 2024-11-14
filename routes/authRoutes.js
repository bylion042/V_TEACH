const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // User model
const router = express.Router();

// Landing page
router.get('/', (req, res) => {
  res.render('landing-page');
});

// Student login page
router.get('/student-login', (req, res) => {
  res.render('student-login');
});

// Student sign-up page
router.get('/student-sign-up', (req, res) => {
  res.render('student-sign-up');
});

// Sign-up POST route
router.post('/student-sign-up', async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('student-sign-up', {
        message: 'Email already exists. Please choose another one.',
        messageType: 'error',
      });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create and save new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    res.render('student-login', {
      message: 'Sign-up successful. You can now log in!',
      messageType: 'success',
    }); // Redirect to login page after successful sign-up
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});




// Login POST route
router.post('/student-login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('student-login', {
        message: 'User not found. Please check your email or sign up.',
        messageType: 'error',
      });
    }
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('student-login', {
        message: 'Invalid credentials. Please try again.',
        messageType: 'error',
      });
    }

    req.session.userId = user._id; // Store user session
    res.redirect('/dashboard'); // Redirect to dashboard after successful login
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});




// Dashboard route (only for logged-in users)
router.get('/dashboard', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/student-login'); // Redirect to login if not logged in
  }
  res.render('dashboard'); // Render dashboard if logged in
});







module.exports = router;
