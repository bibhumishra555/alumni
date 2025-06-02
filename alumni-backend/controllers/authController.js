// File: controllers/authController.js

const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 🔐 Use secret from environment variable
const JWT_SECRET = process.env.JWT_SECRET;

// 📌 Register a new user
exports.register = async (req, res) => {
  try {
    const {
      name,
      fatherName,
      course,
      department,
      regNo,
      passingYear,
      password
    } = req.body;

    console.log("📥 Received signup data:", req.body);

    const existingUser = await User.findOne({ regNumber: regNo });
    if (existingUser) {
      console.log("❌ User already exists");
      return res.status(400).json({ success: false, message: "User already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      fatherName,
      course,
      department,
      regNumber: regNo,
      passingYear,
      password: hashedPassword
    });

    await newUser.save();

    console.log("✅ New user registered:", newUser);
    res.status(201).json({ success: true, message: "User registered successfully" });

  } catch (err) {
    console.error("🚨 Register Error:", err);
    res.status(500).json({ success: false, message: "Server error during registration" });
  }
};

// 🔐 Login a user and set token in cookie
exports.login = async (req, res) => {
  try {
    const { regNo, password } = req.body;

    console.log("🔐 Login attempt for:", regNo);

    const user = await User.findOne({ regNumber: regNo });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { regNo: user.regNumber, userId: user._id },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ Set token as HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: 'Lax',
      secure: false // Use true only with HTTPS
    });

    // ✅ Send success response
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        name: user.name,
        regNo: user.regNumber,
        department: user.department,
        course: user.course
      }
    });

  } catch (err) {
    console.error("🚨 Login Error:", err);
    res.status(500).json({ success: false, message: "Server error during login" });
  }
};
