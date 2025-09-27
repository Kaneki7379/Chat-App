const express = require('express');                   // 1
const router = express.Router();                      // 2
const Message = require('../models/Message');         // 3
const auth = require('../middleware/authMiddleware'); // 4

// Get last 50 messages (protected)
router.get('/', auth, async (req, res) => {           // 5
  const msgs = await Message.find().sort({ timestamp: 1 }).limit(50); // 6
  res.json(msgs);                                     // 7
});

module.exports = router;                              // 8
