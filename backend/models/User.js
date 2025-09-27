const mongoose = require('mongoose');                 // 1
const userSchema = new mongoose.Schema({              // 2
  username: { type: String, required: true, unique: true }, // 3
  password: { type: String, required: true }         // 4
});                                                   // 5
module.exports = mongoose.model('User', userSchema);  // 6
