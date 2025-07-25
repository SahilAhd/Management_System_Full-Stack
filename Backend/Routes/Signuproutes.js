// routes/signup.js

const express = require("express");
const router = express.Router();
const { signup } = require("../Controllers/Signupcontrol"); // ✅ import controller function

// Route: POST /signup
router.post("/", signup);

module.exports = router;
