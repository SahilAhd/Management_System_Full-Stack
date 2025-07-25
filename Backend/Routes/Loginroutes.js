const express = require("express");
const { login } = require("../Controllers/LoginController"); // Import login logic from controller


const router = express.Router();

// Define the login route
router.post("/", login);
module.exports = router;

//when we use export specific route then we use {}, when exoprting a complete route can export like router