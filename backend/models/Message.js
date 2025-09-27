const mongoose = require('mongoose');                 // 1
const messageSchema = new mongoose.Schema({           // 2
  sender: { type: String, required: true },           // 3
  text: { type: String, required: true },             // 4
  timestamp: { type: Date, default: Date.now }        // 5
});                                                   // 6
module.exports = mongoose.model('Message', messageSchema); // 7
