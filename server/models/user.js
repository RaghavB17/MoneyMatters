// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true }, // New field
  lastName: { type: String, required: true },  // New field
  phoneNumber: { type: String, required: true, unique: true }, // New field
});

// Hash the password before saving
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.isPasswordHashed = function (password) {
  const bcryptHashPattern = /^\$2[aby]\$.{56}$/;
  return bcryptHashPattern.test(password);
};

module.exports = mongoose.model('User', UserSchema);
