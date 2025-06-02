// File: authRoutes.js
// Description: This file contains the routes for user authentication, including registration and login.
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middlewares/verifyToken');
const User = require('../models/user');

router.post('/register', authController.register);
router.post('/login', authController.login);

// ✅ Get current logged-in user
router.get('/user/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;