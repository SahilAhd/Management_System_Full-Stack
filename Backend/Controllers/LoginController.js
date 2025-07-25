const User = require("../Model/Schema"); //  Import User schema
const jwt = require("jsonwebtoken"); //  Import JWT for token generation
const bcrypt = require("bcryptjs"); //  Import bcrypt for password comparison


const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login received", req.body);

    const user = await User.findOne({ email });
    console.log("User found:", user);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Incorrect Password!");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    console.log("Stored password:", user.password);

    // ✅ This is what was missing:
    res.json({ 
      message: "Login successful!", 
      token,
      user: {
        name: user.name,
        email: user.email,
         role: user.role  
      }
    });
    
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
};


module.exports = { login };