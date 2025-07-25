const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  permanentadd: { type: String, required: true },
  Pincode: { type: Number, required: true },
  contactnum: { type: Number, required: true, unique: true },
  password: {
    type: String,
    required: true,
validate: {
  validator: function (value) {
    // Skip validation if password is already hashed (starts with $2b$)
    if (value.startsWith('$2b$')) return true;

    return /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
  },
  message:
    "Password must be at least 8 characters long, include one uppercase letter, one number, and one special character.",
}
},
 role: {
    type: String,
    required: true,
    enum: ['admin', 'user'], // optional: to restrict values
  }

}, { timestamps: true });

// we are only handling password becz email handled with above signup schms Hash password before saving to the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("User", userSchema);