// Controllers/signupController.js

const User = require("../Model/Schema");
const bcrypt = require("bcryptjs");

// Handle Signup Logic
const signup = async (req, res) => {
  try {
    const {
      name,
      lastname,
      email,
      permanentadd,
      Pincode,
      contactnum,
      password,
      role
    } = req.body;

    // 1. Check for required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    // 2. Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User with this email already exists" });
    }

    // 3. Prevent multiple admins
    if (role.toLowerCase() === "admin") {
      const existingAdmin = await User.findOne({ role: "admin" });
      if (existingAdmin) {
        return res.status(403).json({ message: "Admin already exists. Only one admin allowed." });
      }
    }

    

    // 5. Create and save user
    const newUser = new User({
      name,
      lastname,
      email,
      permanentadd,
      Pincode,
      contactnum,
      password,
      role
    });

    await newUser.save();

    // 6. Respond with success
    res.status(201).json({
      message: "Signup successful!",
      user: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { signup };
