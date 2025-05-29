const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: String,
  fatherName: String,
  course: String,
  batch: String,
  registrationNumber: String,
  email: { type: String, unique: true },
  password: String,
});

module.exports = mongoose.model('User', userSchema);
